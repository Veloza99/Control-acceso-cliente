import moment from 'moment';

export function extractColDocumentData(data) {
  let dataString = data.barcodes[0]?.data.replaceAll('�', ' ');

  if (!dataString.includes('PubDSK_1')) {
    throw new Error('Invalid barcode data, only PubDSK_1 is supported');
  }

  dataString = dataString.replace('PubDSK_1', '0');
  const sI = dataString.match('[a-zA-Z]').index;
  dataString = dataString.substring(sI - 10);
  const btIndex = dataString.match('[+]|-').index;
  let usableData = dataString.substring(0, btIndex + 1);
  usableData = usableData.replace(/  +/g, ' ');
  const dataArray = usableData.split(' ');

  const firstAlpha = dataArray[0].match('[a-zA-Z]').index;
  const idNumber = Number(dataArray[0].substring(0, firstAlpha)).toString();
  const lastName1 = capitalize(dataArray[0].substring(firstAlpha, dataArray[0].length));
  const lastName2 = dataArray.length > 3 ? capitalize(dataArray[1]) : undefined;
  const firstName1 = dataArray.length > 3 ? capitalize(dataArray[2]) : capitalize(dataArray[1]);
  const middleName = dataArray.length > 4 ? capitalize(dataArray[3]) : undefined;

  const extraData = dataArray.length > 4 ? dataArray[4] : dataArray.length > 3 ? dataArray[3] : dataArray[2];
  const genderIndex = extraData.match(/M|F/).index;
  const gender = extraData.substring(genderIndex, genderIndex + 1) === 'M' ? 'MALE' : 'FEMALE';
  const birthDate = moment(`${extraData.substring(genderIndex + 1, genderIndex + 9)}`, 'YYYYMMDD').toDate();
  const bloodType = extraData.substring(genderIndex + 15, genderIndex + 17);
  const municipalityCode = extraData.substring(genderIndex + 10, genderIndex + 12);
  const departmentCode = extraData.substring(genderIndex + 12, genderIndex + 15);

  return {
    idNumber,
    lastName1,
    lastName2,
    firstName1,
    middleName,
    gender,
    birthDate,
    bloodType,
    fullName: `${firstName1}${middleName ? ` ${middleName}` : ''} ${lastName1} ${lastName2 || ''}`.trim(),
    municipalityCode,
    departmentCode,
  };
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
