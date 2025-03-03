import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  Divider
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchEquipmentStatsApi } from '../api/equipmentsApi';

const EquipmentStats = () => {
  const theme = useTheme();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // สีสำหรับกราฟวงกลม
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await fetchEquipmentStatsApi();
        
        // แปลงข้อมูลให้เหมาะสมกับการแสดงผลในกราฟ
        const formattedData = data.map(item => ({
          name: item.name,
          count: parseInt(item.usage_count),
          description: item.description
        }));
        
        setStats(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching equipment statistics:', err);
        setError('ไม่สามารถดึงข้อมูลสถิติได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // คำนวณอัตราส่วนการใช้งานเป็นเปอร์เซ็นต์
  const calculatePercentage = (count) => {
    const total = stats.reduce((sum, item) => sum + item.count, 0);
    return total > 0 ? ((count / total) * 100).toFixed(1) : 0;
  };

  // Custom tooltip สำหรับ BarChart
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, boxShadow: 3 }}>
          <Typography variant="subtitle2" color="primary">
            {payload[0].payload.name}
          </Typography>
          <Typography variant="body2">
            จำนวนการยืม: {payload[0].value} ครั้ง
          </Typography>
          <Typography variant="body2">
            คิดเป็น: {calculatePercentage(payload[0].value)}%
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  // Custom tooltip สำหรับ PieChart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, boxShadow: 3 }}>
          <Typography variant="subtitle2" color="primary">
            {payload[0].name}
          </Typography>
          <Typography variant="body2">
            จำนวนการยืม: {payload[0].value} ครั้ง
          </Typography>
          <Typography variant="body2">
            คิดเป็น: {calculatePercentage(payload[0].value)}%
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  // Custom label สำหรับ PieChart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6">{error}</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        สถิติการยืมอุปกรณ์
      </Typography>

      {stats.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">ไม่พบข้อมูลสถิติการยืมอุปกรณ์</Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  สถิติการยืมอุปกรณ์ทั้งหมด
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Legend />
                      <Bar dataKey="count" name="จำนวนการยืม" fill={theme.palette.primary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  สัดส่วนการยืมอุปกรณ์
                </Typography>
                <Box sx={{ height: 400, display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="name"
                      >
                        {stats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  รายละเอียดการยืมอุปกรณ์
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {stats.map((item, index) => (
                    <Card key={index} sx={{ mb: 2, boxShadow: 1 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {item.name}
                            </Typography>
                            {item.description && (
                              <Typography variant="body2" color="text.secondary">
                                {item.description}
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" color="primary">
                              {item.count}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {calculatePercentage(item.count)}%
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default EquipmentStats;
