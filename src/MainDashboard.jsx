import React, { useState } from 'react';
import { Container, Grid, Card, CardContent, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import TableComponent from './TableComponent';
import GraphicalAnalysis from './GraphicalAnalysis';

const mockProblemData = [
    {
        id: 1,
        description: 'List the active ingredients for each of the vaccines.',
        sqlStatement: 'SELECT Ingredient FROM VaccineIngredient WHERE IngredientType = "Active";',
        output: [
          { id: 1, vaccineName: 'Pfizer-BioNTech', ingredient: 'mRNA' },
          { id: 2, vaccineName: 'Moderna', ingredient: 'mRNA' },
          { id: 3, vaccineName: 'Johnson & Johnson', ingredient: 'Adenovirus vector' },
          { id: 4, vaccineName: 'AstraZeneca', ingredient: 'Adenovirus vector' },
          // Add more dummy output data if needed
        ],
      },
      {
        id: 2,
        description: 'List the states/jurisdictions and reported COVID deaths on October 31, 2020 for states/jurisdictions with a population exceeding 10,000,000.',
        sqlStatement: 'SELECT Jurisdiction.Name, CovidDeaths.ReportedCovidDeaths FROM CovidDeaths INNER JOIN Jurisdiction ON CovidDeaths.JurisdictionID = Jurisdiction.JurisdictionID WHERE Population > 10000000 AND CalendarDate = "2020-10-31";',
        output: [
          { id: 1, jurisdiction: 'New York', reportedDeaths: 5000 },
          { id: 2, jurisdiction: 'California', reportedDeaths: 6000 },
          { id: 3, jurisdiction: 'Florida', reportedDeaths: 4500 },
          { id: 4, jurisdiction: 'Texas', reportedDeaths: 5500 },
          // Add more dummy output data if needed
        ],
      },
      {
        id: 3,
        description: 'Which states/jurisdictions had one or more reported COVID cases on February 29, 2020? Show the full state/jurisdiction names and number of reported COVID cases in the query output. Show the output in alphabetical order by full state/jurisdiction name',
        sqlStatement: 'SELECT J.Name AS Jurisdiction, CC.ReportedCovidCases FROM CovidCases CC JOIN Jurisdiction J ON CC.JurisdictionID = J.JurisdictionID WHERE CC.CalendarDate = "2020-02-29";',
        output: [
          { id: 1, jurisdiction: 'Washington', reportedCases: 10 },
          { id: 2, jurisdiction: 'California', reportedCases: 15 },
          { id: 3, jurisdiction: 'New York', reportedCases: 20 },
          { id: 4, jurisdiction: 'Florida', reportedCases: 5 },
          // Add more dummy output data if needed
        ],
      },
      {
        id: 4,
        description: 'Show the calendar dates and reported daily COVID-19 deaths exceeding 100 for New York and California in the month of March 2020. Display the full state/jurisdiction names in the query output. Present the query results in chronological order (i.e., oldest to latest calendar dates).',
        sqlStatement: 'SELECT J.Name AS Jurisdiction, CD.CalendarDate, CD.ReportedCovidDeaths FROM CovidDeaths CD JOIN Jurisdiction J ON CD.JurisdictionID = J.JurisdictionID WHERE (J.JurisdictionID = "NY" OR J.JurisdictionID = "CA") AND CD.CalendarDate >= "2020-03-01" AND CD.CalendarDate < "2020-04-01" AND CD.ReportedCovidDeaths > 100 ORDER BY CD.CalendarDate;',
        output: [
          { id: 1, jurisdiction: 'New York', calendarDate: '2020-03-01', reportedDeaths: 120 },
          { id: 2, jurisdiction: 'New York', calendarDate: '2020-03-02', reportedDeaths: 130 },
          // Add more dummy output data if needed
        ],
      },
      {
        id: 5,
        description: 'List the average daily reported COVID case values for Georgia, Florida, and Alabama for the time period between December 1, 2020 and December 31, 2020. Present the full state name and average values in the query output. Group the results by full state name in alphabetical ordert the states/jurisdictions and reported COVID deaths on October 31, 2020 for states/jurisdictions with a population exceeding 10,000,000.',
        sqlStatement: 'SELECT J.Name AS FullStateName, AVG(CC.ReportedCovidCases) AS AverageDailyCases FROM CovidCases CC JOIN Jurisdiction J ON CC.JurisdictionID = J.JurisdictionID WHERE (J.Name = "Georgia" OR J.Name = "Florida" OR J.Name = "Alabama") AND CC.CalendarDate >= "2020-12-01" AND CC.CalendarDate <= "2020-12-31" GROUP BY J.Name ORDER BY J.Name;',
        output: [
          { id: 1, state: 'Georgia', averageCases: 50 },
          { id: 2, state: 'Florida', averageCases: 60 },
          // Add more dummy output data if needed
        ],
      },
      {
        id: 6,
        description: 'List the full vaccine and state/jurisdiction names for vaccines administered on December 30, 2020. Show the reported number of doses administered in the query output. Sort the output in alphabetical order by full vaccine name and then by full state/jurisdiction name.',
        sqlStatement: 'SELECT V.Name AS FullVaccineName, J.Name AS FullStateName, VA.ReportedDosesAdministered FROM VaccineAdministration VA JOIN Vaccine V ON VA.VaccineID = V.VaccineID JOIN Jurisdiction J ON VA.JurisdictionID = J.JurisdictionID WHERE VA.AdministrationDate = "2020-12-30" ORDER BY V.Name, J.Name;',
        output: [
          { id: 1, vaccine: 'Pfizer-BioNTech', state: 'New York', dosesAdministered: 500 },
          { id: 2, vaccine: 'Moderna', state: 'California', dosesAdministered: 600 },
          // Add more dummy output data if needed
        ],
      },
      {
        id: 7,
        description: 'Show the total reported COVID-19 cases exceeding 2,000,000 per state/jurisdiction in the 2021 calendar year. Display the full state/jurisdiction names in the query output. Group the results by full state/jurisdiction name. Present the results in alphabetical order by full state/jurisdiction name. (Hint: GROUP BY and HAVING clauses are required for this query.)',
        sqlStatement: 'SELECT J.Name AS FullStateName, SUM(CC.ReportedCovidCases) AS TotalCases FROM CovidCases CC JOIN Jurisdiction J ON CC.JurisdictionID = J.JurisdictionID WHERE CC.CalendarDate >= "2021-01-01" AND CC.CalendarDate <= "2021-12-31" GROUP BY J.Name HAVING SUM(CC.ReportedCovidCases) > 2000000 ORDER BY J.Name;',
        output: [
          { id: 1, state: 'California', totalCases: 2500000 },
          { id: 2, state: 'Florida', totalCases: 2200000 },
          // Add more dummy output data if needed
        ],
      },
      {
        id: 8,
        description: 'Show the full vaccine names and dose volumes for the adult second dose series. Display the results in alphabetical order by full vaccine name.',
        sqlStatement: 'SELECT V.Name AS FullVaccineName, VD.DoseVolume FROM VaccineDosage VD JOIN Vaccine V ON VD.VaccineID = V.VaccineID WHERE VD.SeriesDose = "Second" AND VD.AdultDose = TRUE ORDER BY V.Name;',
        output: [
          { id: 1, vaccineName: 'Pfizer-BioNTech', doseVolume: 0.3 },
          { id: 2, vaccineName: 'Moderna', doseVolume: 0.25 },
          // Add more dummy output data if needed
        ],
      },
      {
        id: 9,
        description: 'Show the full vaccine names and dose volumes for the adult second dose series. Display the results in alphabetical order by full vaccine name.',
        sqlStatement: 'SELECT V.Name AS FullVaccineName, VD.DoseVolume FROM VaccineDosage VD JOIN Vaccine V ON VD.VaccineID = V.VaccineID WHERE VD.SeriesDose = "Second" AND VD.AdultDose = 1 -- TRUE ORDER BY V.Name;',
        output: [
          { id: 1, vaccineName: 'Pfizer-BioNTech', doseVolume: 0.3 },
          { id: 2, vaccineName: 'Moderna', doseVolume: 0.25 },
          // Add more dummy output data if needed
        ],
      },
      {
        id: 10,
        description: 'Estimate the number of reported COVID-19 cases per 1,000 people in 2021 for Florida, New York, California, Texas, and Michigan. Group and sort the results by full state/jurisdiction name in alphabetical order. The calculation is performed via the following equation: COVID-19 Cases/1,000 people = SUM(Daily Reported COVID-19 Cases * 1000 / Population)',
        sqlStatement: 'SELECT J.Name AS FullStateName, SUM(CC.ReportedCovidCases * 1000.0 / J.Population) AS CasesPerThousand FROM CovidCases CC JOIN Jurisdiction J ON CC.JurisdictionID = J.JurisdictionID WHERE CC.CalendarDate >= "2021-01-01" AND CC.CalendarDate <= "2021-12-31" AND J.Name IN ("Florida", "New York", "California", "Texas", "Michigan") GROUP BY J.Name ORDER BY J.Name;',
        output: [
          { id: 1, state: 'Florida', casesPerThousand: 150 },
          { id: 2, state: 'New York', casesPerThousand: 140 },
          // Add more dummy output data if needed
        ],
      }
];

const MainDashboard = () => {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showOutput, setShowOutput] = useState(false);
  const [outputData, setOutputData] = useState([]);
  const [sqlStatement, setSqlStatement] = useState('');

  const handleButtonClick = (problemId) => {
    if (selectedProblem === problemId && showOutput) {
      // Hide output if the same problem is clicked again
      setSelectedProblem(null);
      setShowOutput(false);
      setSqlStatement('');
    } else {
      // Show output for the selected problem
      setSelectedProblem(problemId);
      setShowOutput(true);
      // Retrieve output data and SQL statement for the selected problem from mock data
      const problem = mockProblemData.find((problem) => problem.id === problemId);
      setOutputData(problem.output);
      setSqlStatement(problem.sqlStatement);
    }
  };

  return (
    <div style={{ backgroundColor: '#001f3f', minHeight: '100vh', padding: '20px' }}>
      <Typography variant="h2" align="center" gutterBottom style={{ color: '#ffffff', marginBottom: '20px' }}>
        COVID-19 Dashboard
      </Typography>
      <Grid container spacing={3}>
        {mockProblemData.map((problem) => (
          <Grid item xs={12} sm={6} md={4} key={problem.id}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Problem {problem.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {problem.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" style={{ marginTop: '20px' }}>
                    SQL Statement: {sqlStatement}
                  </Typography>
                  <Button onClick={() => handleButtonClick(problem.id)} variant="contained" color="primary" fullWidth>
                    {showOutput && selectedProblem === problem.id ? 'Hide Output' : 'Show SQL Statement'}
                  </Button>
                  {showOutput && selectedProblem === problem.id && (
                    <>
                      <Typography variant="h6" style={{ marginTop: '20px' }}>
                        Table Output
                      </Typography>
                      <TableComponent data={outputData} show={showOutput && selectedProblem === problem.id} />
                      <Typography variant="h6" style={{ marginTop: '20px' }}>
                        Graph Output
                      </Typography>
                      <GraphicalAnalysis data={outputData} show={showOutput && selectedProblem === problem.id} />
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MainDashboard;


