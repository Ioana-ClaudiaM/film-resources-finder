import React from 'react';

const faqs = [
  {
    question: "Ce este Film Resources Finder?",
    answer: "Film Resources Finder este o platformă care conectează cineaștii cu resursele esențiale pentru producție."
  },
  {
    question: "Cum mă înscriu?",
    answer: "Te poți înscrie apăsând butonul 'Înregistrează-te' de pe pagina principală și completând formularul de înregistrare."
  },
  {
    question: "Există un cost pentru utilizarea platformei?",
    answer: "Membrul de bază este absolut gratuit, tocmai pentru a încuraja industria cinematografică."
  }
];

const FAQ = () => (
  <div className="faq">
    <h2>Întrebări frecvente</h2>
    <div className="faq-container">
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <h3 className="faq-question">{faq.question}</h3>
          <p className="faq-answer">{faq.answer}</p>
        </div>
      ))}
    </div>
  </div>
);

export default FAQ;
