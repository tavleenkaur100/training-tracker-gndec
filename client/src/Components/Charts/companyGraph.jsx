import React, { useEffect, useState, forwardRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    CategoryScale, LinearScale, Chart, BarElement, Title,
    Tooltip,
    Legend
} from 'chart.js';
import { CircularProgress } from '@mui/material';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CompanyGraph = forwardRef(({ data, years }, ref) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (data) {
            const batchWiseData = {};
            const currentDate = new Date();
            const cutoffYear = currentDate.getFullYear() - years;

            data.forEach((student) => {
                const startYear = parseInt(student.userInfo.batch.split('-')[0]);
                const isPlaced = student.placementData.isPlaced;
                const company = student.placementData.company;
                const salary = student.placementData.package;

                if (isPlaced && startYear >= cutoffYear) {
                    batchWiseData[startYear] = batchWiseData[startYear] || { total: 0, placed: 0, maxPackage: 0, maxCompany: '' };
                    batchWiseData[startYear].total++;
                    batchWiseData[startYear].placed++;

                    // Update max package and company if current student's package is greater
                    if (salary > batchWiseData[startYear].maxPackage) {
                        batchWiseData[startYear].maxPackage = salary;
                        batchWiseData[startYear].maxCompany = company;
                    }
                }
            });

            const labels = Object.keys(batchWiseData);
            const maxPackages = labels.map((year) => (batchWiseData[year]?.maxPackage) / 100000 || 0);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Maximum Package',
                        data: maxPackages,
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 1
                    }
                ]
            });
        }
    }, [data, years]);

    return (
        <div style={{
            width: '580px',
            height: '290px'
        }}>
            {chartData ? (
                <>
                    <Bar
                        ref={ref}
                        data={chartData}
                        options={{
                            responsive: true,
                            legend: {
                                position: 'top',
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Batches', // X-axis label
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Package in LPA', // Y-axis label
                                    },
                                    beginAtZero: true,
                                    max: 20
                                },
                            },
                            plugins: {
                                tooltip: {
                                    enabled: true,
                                    callbacks: {
                                        label: function (context) {
                                            const label = context.dataset.label || '';
                                            if (label) {
                                                {console.log(data[context.dataIndex].placementData.company)}
                                                return [label, `Company: ${data[context.dataIndex].placementData.company}`, `Package: ${data[context.dataIndex].placementData.package}`];
                                            }
                                            return null;
                                        }
                                    }
                                },
                                title: {
                                    display: true,
                                    text: 'Batch Wise Highest Packages',
                                },
                            }
                        }}
                    />
                </>
            ) : (
                <CircularProgress />
            )}
        </div>
    );
});

export default CompanyGraph;