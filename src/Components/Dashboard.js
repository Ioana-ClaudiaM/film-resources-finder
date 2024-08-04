import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import '../Styles/Dashboard.css'; 

Chart.register(...registerables);

const Dashboard = () => {
    const [totalApplications, setTotalApplications] = useState(0);
    const [acceptanceRate, setAcceptanceRate] = useState(0);
    const [avgTimeToDecision, setAvgTimeToDecision] = useState(0);
    const [applicationsTrend, setApplicationsTrend] = useState(null);
    const [applicationsPerFilm, setApplicationsPerFilm] = useState(null);
    const [applicationsPerActor, setApplicationsPerActor] = useState(null);
    const [topFilms, setTopFilms] = useState([]);
    const [topRoles, setTopRoles] = useState([]);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/'); 
    };

    useEffect(() => {
        fetch('http://localhost:8080/statistics/total-applications')
            .then(response => response.json())
            .then(data => setTotalApplications(data[0].totalApplications))
            .catch(error => console.error('Error fetching total applications:', error));

        fetch('http://localhost:8080/statistics/acceptance-rate')
            .then(response => response.json())
            .then(data => setAcceptanceRate(data.acceptanceRate))
            .catch(error => console.error('Error fetching acceptance rate:', error));

        fetch('http://localhost:8080/statistics/average-time-to-decision')
            .then(response => response.json())
            .then(data => setAvgTimeToDecision(data[0].avgTimeToDecision))
            .catch(error => console.error('Error fetching average time to decision:', error));

        fetch('http://localhost:8080/statistics/applications-trend')
            .then(response => response.json())
            .then(data => {
                const labels = data.map(item => item.date);
                const values = data.map(item => item.totalApplications);
                setApplicationsTrend({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Total Applications',
                            data: values,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }
                    ]
                });
            })
            .catch(error => console.error('Error fetching applications trend:', error));

        fetch('http://localhost:8080/statistics/applications-per-film')
            .then(response => response.json())
            .then(data => {
                const labels = data.map(item => item.film);
                const values = data.map(item => item.totalApplications);
                setApplicationsPerFilm({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Numărul de aplicări per film',
                            data: values,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                            ],
                            borderWidth: 1
                        }
                    ]
                });
            })
            .catch(error => console.error('Error fetching applications per film:', error));

        fetch('http://localhost:8080/statistics/applications-per-actor')
            .then(response => response.json())
            .then(data => {
                const labels = data.map(item => item.actor);
                const values = data.map(item => item.totalApplications);
                setApplicationsPerActor({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Numărul de aplicări per actor',
                            data: values,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1
                        }
                    ]
                });
            })
            .catch(error => console.error('Error fetching applications per actor:', error));

        fetch('http://localhost:8080/statistics/top-films')
            .then(response => response.json())
            .then(data => setTopFilms(data))
            .catch(error => console.error('Error fetching top films:', error));

        fetch('http://localhost:8080/statistics/top-roles')
            .then(response => response.json())
            .then(data => setTopRoles(data))
            .catch(error => console.error('Error fetching top roles:', error));
    }, []);

    return (
        <Box className="dashboard">
            <Typography variant="h4" component="h1" gutterBottom className='titlu-dashboard'>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <Card className="stat-card">
                        <CardContent>
                            <Typography variant="h5">Numărul total de aplicări pentru filme</Typography>
                            <Typography variant="h6">{totalApplications}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className="stat-card">
                        <CardContent>
                            <Typography variant="h5">Rata de acceptare a unui actor</Typography>
                            <Typography variant="h6">{acceptanceRate.toFixed(2)}%</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className="stat-card">
                        <CardContent>
                            <Typography variant="h5">Timpul mediu de decizie pentru notarea unei aplicări</Typography>
                            <Typography variant="h6">{avgTimeToDecision.toFixed(2)} zile</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Box className="chart-container">
                <Typography variant="h6">Graficul aplicărilor în funcție de dată și numărul lor</Typography>
                {applicationsTrend ? (
                    <Line data={applicationsTrend} />
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Box className="chart-container">
                        <Typography variant="h6">Numărul de aplicări per film</Typography>
                        {applicationsPerFilm ? (
                            <Pie data={applicationsPerFilm} />
                        ) : (
                            <Typography>Loading...</Typography>
                        )}
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box className="chart-container">
                        <Typography variant="h6">Numărul de aplicări per actor</Typography>
                        {applicationsPerActor ? (
                            <Bar data={applicationsPerActor} />
                        ) : (
                            <Typography>Loading...</Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Card className="top-card">
                        <CardContent>
                            <Typography variant="h6">Top 5 Filme</Typography>
                            {topFilms.length > 0 ? (
                                <ul>
                                    {topFilms.map((film, index) => (
                                        <li key={index}>{film.name}</li>
                                    ))}
                                </ul>
                            ) : (
                                <Typography>Loading...</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card className="top-card">
                        <CardContent>
                            <Typography variant="h6">Top 5 Roluri</Typography>
                            {topRoles.length > 0 ? (
                                <ul>
                                    {topRoles.map((role, index) => (
                                        <li key={index}>{role.name}</li>
                                    ))}
                                </ul>
                            ) : (
                                <Typography>Loading...</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <button className='inapoi-pe-homepage2' onClick={handleBack}>Înapoi pe pagina principală</button>
        </Box>
        
    );
};

export default Dashboard;
