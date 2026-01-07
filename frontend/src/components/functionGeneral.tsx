import Alert from "./ui/alert/Alert";

export const baseUrl = 'http://192.168.1.17:5359/api/raqoshop/';

export function formatDeDate(dateSended: Date | string): string {
  let dateObject = new Date(dateSended);
  let formattedDate = dateObject.toISOString().split('T')[0]
  let HourSplited = dateObject.toISOString().split('T')[1]
  let formattedHour = HourSplited.split(':')[0] + ':' + HourSplited.split(':')[1]
  return `${formattedDate} à ${formattedHour}`
}

export const getApiMessage = (isError: boolean, message: string) => {
  if (isError && message !== "") {
    return (
      <Alert
        variant="error"
        title="Error"
        message={message}
        showLink={false}
      />
    )
  } else if (!isError && message !== "") {
    return (
      <Alert
        variant="success"
        title="Success"
        message={message}
        showLink={false}
      />
    )
  } else {
    return null;
  }
}

export function getFilePathFromDBPath(dbPath: string): string {
  const pathWithoutSrc = dbPath.replace(/\\/g, "/");
  // return `https://apicommerce.ababi.ci/${pathWithoutSrc}`;

  return `${baseUrl}/${pathWithoutSrc}`;
}