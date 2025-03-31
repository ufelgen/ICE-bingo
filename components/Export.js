import styled from "styled-components";
import format from "date-fns/format";

export default function ExportDataOption({
  setTrainsArrayFor3by3,
  setTrainsArrayFor4by4,
}) {
  function exportData() {
    const trainsData3x3 = localStorage.getItem("trainsArrayFor3by3") || "[]";
    const trainsData4x4 = localStorage.getItem("trainsArrayFor4by4") || "[]";
    const trainsData = {
      trainsArrayFor3by3: trainsData3x3,
      trainsArrayFor4by4: trainsData4x4,
    };

    const today = format(new Date(), "yyyy-MM-dd");

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(trainsData)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${today}_ICE-bingo.json`;

    if (document.body) {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  async function importData(event) {
    if (event.target.files) {
      const trainData = await readJsonFile(event.target.files[0]);

      const confirmation = confirm(
        "Willst du die bisher gespeicherten Daten ersetzen? Dieser Vorgang kann nicht rückgängig gemacht werden. Du kannst deine aktuellen ICE-Bingo-Daten aber vorher exportieren."
      );
      if (confirmation) {
        if (trainData.trainsArrayFor3by3 && trainData.trainsArrayFor4by4) {
          setTrainsArrayFor3by3(JSON.parse(trainData.trainsArrayFor3by3));
          setTrainsArrayFor4by4(JSON.parse(trainData.trainsArrayFor4by4));
        } else {
          alert(
            "Da hat etwas nicht funktioniert. Überprüfe bitte die hochgeladene Datei."
          );
        }
      }

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

      fileReader.onerror = (error) => {
        console.error("Fehler beim Lesen der Datei:", error);
        alert("Fehler: Die Datei konnte nicht gelesen werden.");
        reject(error);
      };
      fileReader.readAsText(file);
    });
  }

  return (
    <ExportImportField>
      <button onClick={exportData}>Daten exportieren</button>
      <label htmlFor="import">Daten importieren:</label>
      <input
        type="file"
        accept=".json,application/json"
        onChange={importData}
        id="import"
        name="import"
      />
    </ExportImportField>
  );
}

const ExportImportField = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center; //justify-content: space-around;

  button {
    border: 1px solid red;
    border-radius: 5px;
    width: 70vw;
    margin-bottom: 1rem;
  }
`;
