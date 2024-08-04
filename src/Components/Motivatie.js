import React from 'react';

function Motivatie({ motivatie, setMotivatie, raspuns1, setRaspuns1, raspuns2, setRaspuns2, setCurrentSection,currentSection }) {
    return (
        <div className='formular-rol-section'>
            <p className='paragraf-motivatie'>Motivatia personala pentru rolul selectat:</p>
            <textarea
                className='introducere-motivatie'
                value={motivatie}
                onChange={(e) => setMotivatie(e.target.value)}
            ></textarea>
            <div className='intrebari-specifice'>
                <p>De ce considerati ca sunteti potrivit pentru acest rol?</p>
                <textarea
                    className='introducere-motivatie'
                    value={raspuns1}
                    onChange={(e) => setRaspuns1(e.target.value)}
                ></textarea>
                <p>Care sunt cele mai mari contributii pe care le-ai putea aduce acestui proiect/film?</p>
                <textarea
                    className='introducere-motivatie'
                    value={raspuns2}
                    onChange={(e) => setRaspuns2(e.target.value)}
                ></textarea>
            </div>
            <div className='buttons-form'>
                <button onClick={() => setCurrentSection(String(Number(currentSection) - 1))}>Înapoi</button>
                <button onClick={() => setCurrentSection(String(Number(currentSection) + 1))}>Mai departe</button>
            </div>
        </div>
    );
}

export default Motivatie;
