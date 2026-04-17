import React, { useState } from 'react';
import './FormacionTecnica.css';

const FormacionTecnica = ({ t }) => {
  const [activeTab, setActiveTab] = useState(null);
  const data = [
    { id: "ds", titulo: "Data Science & Machine Learning", institucion: "Alura LATAM / G9 - ONE", color: "#FF007A", numFormaciones: 3, horas: 184,
      formaciones: [
        { nombre: "Aprendiendo a hacer ETL", cursos: ["NumPy: análisis numérico eficiente", "Pandas E/S: formatos de archivo", "Pandas: transformación y manipulación", "Visualización de datos: gráficos y tablas", "IA aplicada a la ciencia de datos"] },
        { nombre: "Estadísticas y Machine Learning", cursos: ["Estadística con Python: frecuencias y medidas", "Estadística con Python: Probabilidad y muestreo", "Data Science: regresión lineal", "Clasificación con Machine Learning", "Validación de modelos y métricas"] },
        { nombre: "Fundamentos de Python y Datos", cursos: ["Python para Data Science: primeros pasos", "Practicando Python: condicionales y bucles", "Modelado de bases de datos: entidades y atributos", "Pandas: conociendo la biblioteca"] }
      ]
    },
    { id: "dev", titulo: "Desarrollo Web & Programación", institucion: "Alura LATAM / G9 - ONE", color: "#00FF66", numFormaciones: 2, horas: 99,
      formaciones: [
        { nombre: "Principiante en Programación G9", cursos: ["Lógica de programación con JS", "Git y GitHub: repositorio y versiones", "IA: explorando el potencial generativo", "Ingeniería de Prompt", "HTML y CSS: estructura, clases y flexbox"] },
        { nombre: "Lógica de programación con JS", cursos: ["Lógica de programación: sumérgete", "Explorar funciones y listas"] }
      ]
    },
    { id: "soft", titulo: "Desarrollo Personal & Soft Skills", institucion: "Alura LATAM / G9 - ONE", color: "#FDFD96", numFormaciones: 2, horas: 73,
      formaciones: [
        { nombre: "Desarrollo Personal", cursos: ["Aprender a aprender: técnicas de autodesarrollo", "LinkedIn para profesionales", "Foco: resultados en el día a día", "Hábitos: productividad y metas", "Aprendizaje con IA: ChatGPT"] },
        { nombre: "Emprendimiento y Agilidad", cursos: ["Desarrollo de carrera y demanda", "Propósito profesional y protagonismo", "Fundamentos de Agilidad", "Emprendimiento: de la idea al plan"] }
      ]
    },
    { id: "geo", titulo: "Geointeligencia y Gobernanza", institucion: "ITDP / GIZ / INAFED", color: "#00E5FF", numFormaciones: 1, horas: 120,
      formaciones: [
        { nombre: "Digitalización del Transporte Público", cursos: ["Módulo 1: Marco normativo y gobernanza", "Módulo 2: Sistemas de Información Geográfica", "Módulo 3: Modelado de datos operativos", "Módulo 4: Digitalización de servicios urbanos"] }
      ]
    }
  ];

  return (
    <section id="formacion-tecnica-seccion" className="formacion-section">
      <div className="formacion-header">
        <h2 className="formacion-title"><span>#</span> {t.titulo}</h2>
      </div>
      <div className="formacion-layout">
        <aside className="formacion-insights">
          <div className="insight-box"><span className="insight-label">{t.especialidades}</span><span className="insight-value">4</span></div>
          <div className="insight-box"><span className="insight-label">{t.formaciones}</span><span className="insight-value">8</span></div>
          <div className="insight-box"><span className="insight-label">{t.cursos}</span><span className="insight-value">44</span></div>
          <div className="insight-box"><span className="insight-label">{t.horas}</span><span className="insight-value">476</span></div>
        </aside>
        <main className="formacion-list">
          {data.map((item) => (
            <div key={item.id} className={`especialidad-card ${activeTab === item.id ? 'open' : ''}`} style={{ '--accent-color': item.color }}>
              <div className="especialidad-header" onClick={() => setActiveTab(activeTab === item.id ? null : item.id)}>
                <div className="especialidad-info">
                  <h3>{item.titulo}</h3>
                  <p className="especialidad-meta">{item.institucion} • {item.numFormaciones} {t.formaciones} • {item.horas} {t.horas.split(' ')[1]}</p>
                </div>
                <span className="plus-minus">{activeTab === item.id ? '−' : '+'}</span>
              </div>
              <div className="especialidad-content">
                {item.formaciones.map((form, idx) => (
                  <div key={idx} className="formacion-item">
                    <h4>// {form.nombre}</h4>
                    <div className="cursos-list">
                      {form.cursos.map((curso, cIdx) => (<div key={cIdx} className="curso-line">• {curso}</div>))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </section>
  );
};

export default FormacionTecnica;