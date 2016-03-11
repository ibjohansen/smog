export default () => {
  return new Promise((resolve, reject) => {
    const url = 'http://apigram.herokuapp.com/artifex/new';
    const xmlHTTP = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("MicrosoftXMLHTTP");

    xmlHTTP.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200)
        resolve(JSON.parse(this.responseText));
    };
    xmlHTTP.open("GET", url, true);
    xmlHTTP.send();
  })
};
