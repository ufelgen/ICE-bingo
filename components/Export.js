import styled from "styled-components";
import format from "date-fns/format";

export default function ExportDataOption({
  setTrainsArrayFor3by3,
  setTrainsArrayFor4by4,
}) {
  function exportData() {
    const trainsData3x3 = localStorage.getItem("trainsArrayFor3by3");
    const trainsData4x4 = localStorage.getItem("trainsArrayFor4by4");
    const trainsData = {
      trainsArrayFor3by3: trainsData3x3,
      trainsArrayFor4by4: trainsData4x4,
    };

    const today = format(new Date(), "yyyy-MM-dd");

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(trainsData)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${today}_ICE-bingo.json`;

    link.click();
  }

  async function importData(event) {
    if (event.target.files) {
      const parsedData = await readJsonFile(event.target.files[0]);
      //const parsedData = JSON.parse(jsonData);

      console.log("3by3", JSON.parse(parsedData.trainsArrayFor3by3));
      setTrainsArrayFor3by3(JSON.parse(parsedData.trainsArrayFor3by3));
      setTrainsArrayFor4by4(JSON.parse(parsedData.trainsArrayFor4by4));

      event.target.value = "";
    }
  }

  function readJsonFile(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        if (event.target) {
          resolve(JSON.parse(event.target.result));
        }
      };

      fileReader.onerror = (error) => reject(error);
      fileReader.readAsText(file);
    });
  }

  return (
    <>
      <button onClick={exportData}>export</button>
      <input
        type="file"
        accept=".json,application/json"
        onChange={importData}
      />
    </>
  );
}
