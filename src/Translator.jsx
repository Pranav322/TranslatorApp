import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, MenuItem, Select, Typography, Grid } from '@mui/material';
import axios from 'axios';

const Translator = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLang, setFromLang] = useState('');
  const [toLang, setToLang] = useState('');
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const subscriptionKey = process.env.REACT_APP_TRANSLATOR_KEY;
      const endpoint = process.env.REACT_APP_TRANSLATOR_ENDPOINT;

      const response = await axios.get(`${endpoint}/languages?api-version=3.0`, {
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Ocp-Apim-Subscription-Region': process.env.REACT_APP_SUBSCRIPTION_REGION
        }
      });

      // Extracting languages from response data
      const languagesArray = Object.keys(response.data.translation).map(key => ({
        code: key,
        name: response.data.translation[key].name
      }));

      setLanguages(languagesArray);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const detectLanguage = async () => {
    try {
      const subscriptionKey = process.env.REACT_APP_TRANSLATOR_KEY;
      const endpoint = process.env.REACT_APP_TRANSLATOR_ENDPOINT;

      const response = await axios.post(`${endpoint}/detect?api-version=3.0`, 
        [{ Text: text }],
        {
          headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Region': process.env.REACT_APP_SUBSCRIPTION_REGION
          }
        });

      setFromLang(response.data[0].language);
    } catch (error) {
      console.error('Error detecting language:', error);
    }
  };

  const translateText = async () => {
    try {
      const subscriptionKey = process.env.REACT_APP_TRANSLATOR_KEY;
      const endpoint = process.env.REACT_APP_TRANSLATOR_ENDPOINT;

      const response = await axios.post(`${endpoint}/translate?api-version=3.0&from=${fromLang}&to=${toLang}`, 
        [{ Text: text }],
        {
          headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Region': process.env.REACT_APP_SUBSCRIPTION_REGION
          }
        });

      setTranslatedText(response.data[0].translations[0].text);
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Translator</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Text to translate"
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">From Language</Typography>
          <Select
            value={fromLang}
            onChange={(e) => setFromLang(e.target.value)}
            fullWidth
            disabled={!fromLang} // Disable if fromLang is set (i.e., not empty)
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">To Language</Typography>
          <Select
            value={toLang}
            onChange={(e) => setToLang(e.target.value)}
            fullWidth
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={detectLanguage}>Auto Detect Language</Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={translateText} fullWidth>Translate</Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Translated Text</Typography>
          <Typography>{translatedText}</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Translator;
