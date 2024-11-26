import { parse } from 'fast-csv';
import { createReadStream } from 'fs';

// const app = express()

// app.get('/', (req, res) => {
//   res.send('Hello World')
// })

// app.listen(2345)

const datasetCSV = createReadStream('datasets/Irrigation Scheduling.csv')
let csvData = []

datasetCSV.pipe(parse({ headers: true }))
  .on('data', row => {
    // Drop null values
    if (nullValues(row)) return
    csvData.push(row)
  })
  .on('end', () => {
    // Remove columns from the dataset that i won't be using.
    csvData = removeColumns(csvData, ['id', 'note', 'date', 'time', 'status'])
    const classTypes = new Set(csvData.map(row => row['class']))
    csvData = convertTextToNumber(csvData, 'class', classTypes)
    console.log(csvData)
  })

function nullValues(row) {
  Object.entries(row).forEach(([key, value] )=> {
    if (value === null || value === '') {
      console.log('Cleaned row:', key)
      return true
    }
  })
}

function removeColumns(arr, columns) {
  return arr.map(row => {
    columns.forEach(column => {
      delete row[column]
    })
    return row
  })
}

// Convert text values to numbers
function convertTextToNumber(arr, column, sets) {  
  let classZ = Array.from(sets)
  return arr.map(row => {
    const index = classZ.indexOf(row[column]);
    if (index !== -1) {
      row[column] = {
        title: row[column],
        index
      };
    }
    return row
  })
}