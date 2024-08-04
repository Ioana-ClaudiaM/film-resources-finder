import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, TextField, Button, Grid, Card, CardContent, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ProducatorAppBar from '../Components/ProducatorAppBar';
import { Bar } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import '../Styles/OfertareResurse.css';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function OfertareResurse() {
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState({
    cazare: '',
    costCazare: '',
    spatiiFilmare: '',
    costSpatiiFilmare: '',
    meniuri: '',
    costMeniuri: '',
    makeup: '',
    costMakeup: '',
    costume: '',
    costCostume: '',
    buget: '',
    preferinte: '',
    metodePlata: '',
    termeniPlata: '',
    perioadaInchiriereStart: '',
    perioadaInchiriereEnd: '',
    numarPersoane: '',
    preferinteAlimentare: '',
    serviciiAditionale: '',
    locatii: [{ locatie: '' }],
    documente: [],
    contactUrgenta: '',
    economii: ''
  });

  const [guides] = useState([
    { title: 'Ghid 1', url: '/guides/Ghid1_Bugetarea_Filmelor.pdf' },
    { title: 'Ghid 2', url: '/guides/Ghid2_Planificarea_Productiei.pdf' }
  ]);

  const openGuide = (url) => {
    window.open(url, '_blank');
  };

  const [economii, setEconomii] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocatieChange = (index, event) => {
    const newLocatii = [...formData.locatii];
    newLocatii[index].locatie = event.target.value;
    setFormData({ ...formData, locatii: newLocatii });
  };

  const addLocatie = () => {
    setFormData((prevData) => ({
      ...prevData,
      locatii: [...prevData.locatii, { locatie: '' }],
    }));
  };

  const removeLocatie = (index) => {
    const newLocatii = formData.locatii.filter((_, i) => i !== index);
    setFormData({ ...formData, locatii: newLocatii });
  };

  const handleDocumentUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData((prevData) => ({
      ...prevData,
      documente: [...prevData.documente, ...files],
    }));
  };

  const removeDocument = (index) => {
    const newDocumente = formData.documente.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      documente: newDocumente,
    }));
  };

  const validateForm = () => {
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please fill out all required fields.');
      return;
    }
    const producatorId = 1;
    const response = await fetch('http://localhost:8080/roleapplication/post-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        producatorId,
        ...formData,
      }),
    });

    if (response.ok) {
      console.log('Cererea a fost postată cu succes!');
    } else {
      console.error('Eroare la postarea cererii.');
    }
  };

  const calculateSavings = () => {
    const estimatedCosts = [
      formData.costCazare,
      formData.costSpatiiFilmare,
      formData.costMeniuri,
      formData.costMakeup,
      formData.costCostume,
    ].reduce((acc, cost) => acc + parseFloat(cost || 0), 0);
    setEconomii(formData.buget - estimatedCosts);
  };

  useEffect(() => {
    calculateSavings();
  }, [formData]);

  const renderBudgetChart = () => {
    const data = {
      labels: ['Cazare', 'Spații de Filmare', 'Meniuri', 'Makeup', 'Costume'],
      datasets: [
        {
          label: 'Costuri Estimate',
          data: [
            formData.costCazare,
            formData.costSpatiiFilmare,
            formData.costMeniuri,
            formData.costMakeup,
            formData.costCostume,
          ].map(cost => parseFloat(cost || 0)),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Buget Disponibil',
          data: Array(5).fill(parseFloat(formData.buget || 0)),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById('request-summary');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('cerere-resurse.pdf');
    });
  };

  return (
    <div className="ofertare-resurse">
      <ProducatorAppBar />
      <div className='header-ofertare-resurse'>
        <h1>Postare cerere pentru resurse necesare producției filmului</h1>
        <p>În cadrul secțiunilor de mai jos puteți posta o cerere în ceea ce presupune resursele necesare producției cinematografice, iar ulterior aceasta va fi vizibilă furnizorilor care vă vor putea contacta în legătură cu ofertele de care dispun.</p>
      </div>
      <div className='formular-cerere-resurse'>
        <Tabs className='tabs' value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab className='tab' label="Cazare" />
          <Tab label="Spații de Filmare" />
          <Tab label="Meniuri" />
          <Tab label="Servicii de Make-up" />
          <Tab label="Costume" />
          <Tab label="Buget și Preferințe" />
          <Tab label="Perioada de Închiriere" />
          <Tab label="Detalii Suplimentare" />
          <Tab label="Locații" />
          <Tab label="Documente și Contact" />
          <Tab label="Previzualizare" />
          <Tab label="Analiza Economică" />
        </Tabs>
        <form className='form-resurse' onSubmit={handleSubmit}>
          <TabPanel value={value} index={0}>
            <TextField
              fullWidth
              label="Cazare"
              multiline
              rows={4}
              variant="outlined"
              value={formData.cazare}
              name="cazare"
              onChange={handleInputChange}
              placeholder="Descrie cerințele de cazare"
            />
            <TextField
              fullWidth
              label="Cost Cazare"
              type="number"
              variant="outlined"
              value={formData.costCazare}
              name="costCazare"
              onChange={handleInputChange}
              placeholder="Introdu costul estimat pentru cazare"
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TextField
              fullWidth
              label="Spații de Filmare"
              multiline
              rows={4}
              variant="outlined"
              value={formData.spatiiFilmare}
              name="spatiiFilmare"
              onChange={handleInputChange}
              placeholder="Descrie cerințele pentru spațiile de filmare"
            />
            <TextField
              fullWidth
              label="Cost Spații de Filmare"
              type="number"
              variant="outlined"
              value={formData.costSpatiiFilmare}
              name="costSpatiiFilmare"
              onChange={handleInputChange}
              placeholder="Introdu costul estimat pentru spațiile de filmare"
            />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <TextField
              fullWidth
              label="Meniuri"
              multiline
              rows={4}
              variant="outlined"
              value={formData.meniuri}
              name="meniuri"
              onChange={handleInputChange}
              placeholder="Descrie cerințele pentru meniurile de mâncare"
            />
            <TextField
              fullWidth
              label="Cost Meniuri"
              type="number"
              variant="outlined"
              value={formData.costMeniuri}
              name="costMeniuri"
              onChange={handleInputChange}
              placeholder="Introdu costul estimat pentru meniuri"
            />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <TextField
              fullWidth
              label="Servicii de Make-up"
              multiline
              rows={4}
              variant="outlined"
              value={formData.makeup}
              name="makeup"
              onChange={handleInputChange}
              placeholder="Descrie cerințele pentru serviciile de make-up"
            />
            <TextField
              fullWidth
              label="Cost Make-up"
              type="number"
              variant="outlined"
              value={formData.costMakeup}
              name="costMakeup"
              onChange={handleInputChange}
              placeholder="Introdu costul estimat pentru serviciile de make-up"
            />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <TextField
              fullWidth
              label="Costume"
              multiline
              rows={4}
              variant="outlined"
              value={formData.costume}
              name="costume"
              onChange={handleInputChange}
              placeholder="Descrie cerințele pentru costume"
            />
            <TextField
              fullWidth
              label="Cost Costume"
              type="number"
              variant="outlined"
              value={formData.costCostume}
              name="costCostume"
              onChange={handleInputChange}
              placeholder="Introdu costul estimat pentru costume"
            />
          </TabPanel>
          <TabPanel value={value} index={5}>
            <TextField
              fullWidth
              label="Buget"
              type="number"
              variant="outlined"
              value={formData.buget}
              name="buget"
              onChange={handleInputChange}
              placeholder="Introdu bugetul disponibil"
            />
            <TextField
              fullWidth
              label="Preferințe"
              multiline
              rows={4}
              variant="outlined"
              value={formData.preferinte}
              name="preferinte"
              onChange={handleInputChange}
              placeholder="Descrie preferințele producătorului"
            />
            <TextField
              fullWidth
              label="Metode de Plată"
              variant="outlined"
              value={formData.metodePlata}
              name="metodePlata"
              onChange={handleInputChange}
              placeholder="Introdu metodele de plată acceptate"
            />
            <TextField
              fullWidth
              label="Termeni de Plată"
              variant="outlined"
              value={formData.termeniPlata}
              name="termeniPlata"
              onChange={handleInputChange}
              placeholder="Introdu termenii de plată (de exemplu, avansuri, plăți eșalonate)"
            />
          </TabPanel>
          <TabPanel value={value} index={6}>
            <TextField
              fullWidth
              label="Perioada de Închiriere Start"
              type="date"
              variant="outlined"
              value={formData.perioadaInchiriereStart}
              name="perioadaInchiriereStart"
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Perioada de Închiriere End"
              type="date"
              variant="outlined"
              value={formData.perioadaInchiriereEnd}
              name="perioadaInchiriereEnd"
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </TabPanel>
          <TabPanel value={value} index={7}>
            <TextField
              fullWidth
              label="Număr de Persoane"
              type="number"
              variant="outlined"
              value={formData.numarPersoane}
              name="numarPersoane"
              onChange={handleInputChange}
              placeholder="Numărul de persoane"
            />
            <TextField
              fullWidth
              label="Preferințe Alimentare"
              multiline
              rows={4}
              variant="outlined"
              value={formData.preferinteAlimentare}
              name="preferinteAlimentare"
              onChange={handleInputChange}
              placeholder="Descrie preferințele alimentare"
            />
            <TextField
              fullWidth
              label="Servicii Adiționale"
              multiline
              rows={4}
              variant="outlined"
              value={formData.serviciiAditionale}
              name="serviciiAditionale"
              onChange={handleInputChange}
              placeholder="Descrie serviciile adiționale necesare"
            />
          </TabPanel>
          <TabPanel value={value} index={8}>
            {formData.locatii.map((locatie, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextField
                  fullWidth
                  label={`Locația ${index + 1}`}
                  variant="outlined"
                  value={locatie.locatie}
                  onChange={(e) => handleLocatieChange(index, e)}
                  placeholder={`Locația ${index + 1}`}
                  margin="normal"
                />
                <IconButton onClick={() => removeLocatie(index)} aria-label="delete" color="secondary">
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
            <Button variant="contained" color="secondary" onClick={addLocatie}>
              + Adaugă Locație
            </Button>
          </TabPanel>
          <TabPanel value={value} index={9}>
            <input type="file" multiple onChange={handleDocumentUpload} />
            <List>
              {formData.documente.map((doc, index) => (
                <ListItem key={index}>
                  <ListItemText primary={doc.name} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => removeDocument(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <TextField
              fullWidth
              label="Contact de Urgență"
              variant="outlined"
              value={formData.contactUrgenta}
              name="contactUrgenta"
              onChange={handleInputChange}
              placeholder="Nume și detalii de contact"
              margin="normal"
            />
          </TabPanel>
          <TabPanel value={value} index={10}>
            <div id="request-summary">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card className='card-resurse'>
                    <CardContent className='continut-card-resurse'>
                      <Typography variant="h6">Cazare</Typography>
                      <Typography>{formData.cazare}</Typography>
                      <Typography>Cost: {formData.costCazare}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Spații de Filmare</Typography>
                      <Typography>{formData.spatiiFilmare}</Typography>
                      <Typography>Cost: {formData.costSpatiiFilmare}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Meniuri</Typography>
                      <Typography>{formData.meniuri}</Typography>
                      <Typography>Cost: {formData.costMeniuri}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Make-up</Typography>
                      <Typography>{formData.makeup}</Typography>
                      <Typography>Cost: {formData.costMakeup}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Costume</Typography>
                      <Typography>{formData.costume}</Typography>
                      <Typography>Cost: {formData.costCostume}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Buget și Preferințe</Typography>
                      <Typography>Buget: {formData.buget}</Typography>
                      <Typography>Preferințe: {formData.preferinte}</Typography>
                      <Typography>Metode de Plată: {formData.metodePlata}</Typography>
                      <Typography>Termeni de Plată: {formData.termeniPlata}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Perioada de Închiriere</Typography>
                      <Typography>Start: {formData.perioadaInchiriereStart}</Typography>
                      <Typography>End: {formData.perioadaInchiriereEnd}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Detalii Suplimentare</Typography>
                      <Typography>Număr de Persoane: {formData.numarPersoane}</Typography>
                      <Typography>Preferințe Alimentare: {formData.preferinteAlimentare}</Typography>
                      <Typography>Servicii Adiționale: {formData.serviciiAditionale}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Locații</Typography>
                      {formData.locatii.map((locatie, index) => (
                        <Typography key={index}>{locatie.locatie}</Typography>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Documente și Contact</Typography>
                      {formData.documente.map((doc, index) => (
                        <Typography key={index}>{doc.name}</Typography>
                      ))}
                      <Typography>Contact de Urgență: {formData.contactUrgenta}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>
            <Box className='butoane-cerere' mt={2}>
              <Button variant="contained" color="secondary" onClick={handleDownloadPDF}>
                Descarcă PDF
              </Button>
              <Button variant="contained" color="primary" type="submit">
              Postează Cererea
            </Button>
            </Box>
          </TabPanel>
          <TabPanel value={value} index={11}>
        <Typography variant="h6">Analiza Economică</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card className='card-analiza'>
              <CardContent className='continut-card-analiza'>
                <Typography variant="h6">Costuri Estimate și Buget Disponibil</Typography>
                {renderBudgetChart()}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card className='card-analiza'>
              <CardContent className='continut-card-analiza'>
                <Typography variant="h6">Economii Potențiale</Typography>
                <Typography>{economii >= 0 ? `Ai economisit ${economii} lei` : `Buget depășit cu ${-economii} lei`}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card className='card-analiza'>
              <CardContent className='continut-card-analiza'>
                <Typography variant="h6">Ghiduri și Resurse</Typography>
                <Typography>Consultați ghidurile noastre pentru a optimiza bugetul și a reduce costurile de producție.</Typography>
                <Button variant="contained" color="primary" onClick={() => openGuide('/guides/Ghid1_Bugetarea_Filmelor.pdf')}>Accesează Ghid 1</Button>
                <Button variant="contained" color="primary" onClick={() => openGuide('/guides/Ghid2_Planificarea_Productiei.pdf')} style={{ marginLeft: '10px' }}>Accesează Ghid 2</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
          <Box className='introducere-text' mt={2}>
          
          </Box>
        </form>
      </div>
    </div>
  );
}

export default OfertareResurse;
