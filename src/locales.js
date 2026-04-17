export const locales = {
  es: {
    nav: { proyectos: "Proyectos", formacion: "Formacion", Sobre_Mi: "Sobre_Mi", contacto: "Contacto" },
    hero: {
      archivoPy: "perfil_profesional.py",
      clase: "Urbanista",
      subclase: "DataScientist",
      bio: "Decodifico la ciudad a través de la ciencia de datos. Programo para que la planificación urbana deje de basarse en intuiciones y empiece a escuchar, con evidencia, a quienes habitan la ciudad.",
      perfilLabel: "Analista de Datos Geoespaciales",
      cta: "CONTACTO",
      cvBtn: "DESCARGAR_CV"
    },
    formacion: {
      titulo: "Formación técnica",
      especialidades: "Especialidades",
      formaciones: "Formaciones",
      cursos: "Cursos completados",
      horas: "Horas totales"
    },
    viajaSegura: {
      fileName: "01_viaja_segura",
      ejecutar: "EJECUTAR ANÁLISIS",
      cardDescription1: "Transformación de operaciones analógicas en la periferia alta del sur de la CDMX en un modelo de datos estructurado para la validación técnica de servicios de transporte.",
      cardDescription2: "El análisis implementa flujos ETL y modelado GIS para correlacionar flujos de movilidad con nodos de equipamiento urbano relacionados con el cuidado, generando la evidencia necesaria para la toma de decisiones estratégicas.",
      subtitle: "MOVILIDAD DE CUIDADOS",
      title: "VIAJA SEGURA",
      role: "Legitimación de servicios de transporte mediante evidencia geoespacial",
      proposito: {
        title: "01. El Propósito", tag: "#DataDrivenLegitimacy",
        content: "El proyecto evalúa la operación de la \"Ruta 66\", la cual presta un servicio exclusivo para mujeres e infancias en la periferia sur de la CDMX. El reto consistió en traducir una operación analógica y social en un modelo de datos estructurado para sustentar su relevancia ante SEMOVI. El objetivo central fue construir el sustento operativo necesario para legitimar el modelo y proyectar su ampliación a otras rutas mediante evidencia técnica."
      },
      metodologia: {
        title: "02. Estructura y Metodología", tag: "#DataEngineering_GIS",
        etlKey: "Ingeniería de Datos (ETL):",
        etlText: "Diseño de instrumentos de captura digital para normalizar registros de ascenso. Se utiliza Python (GeoPandas) para la limpieza, depuración y estructuración de la primera base de datos, resolviendo inconsistencias de georreferenciación.",
        spatialKey: "Modelado Espacial Avanzado:",
        spatialText: "En GIS, se generaron modelos de accesibilidad mediante isocronas caminables de 500m. El análisis consiste en automatizar el cruce de la oferta de transporte con la infraestructura de cuidados, correlacionando nodos de mayor afluencia con la ubicación de equipamiento."
      },
      insights: {
        title: "03. Insights y Visualización", tag: "#TheProduct",
        intro: "El resultado es una herramienta que transforma coordenadas y datos en decisiones:",
        ejeKey: "Eje de Integración:",
        ejeText: "Conecta la periferia alta (Oyamel, Ocotal, Antigua) con equipamiento regional como Ciudad Universitaria.",
        valKey: "Validación de la Demanda:",
        valText: "Legitimación de la ruta como eslabón en la red de movilidad de cuidados.",
        visKey: "Visualización de Impacto:",
        visText: "Dashboard interactivo que visibiliza la economía de cuidados para incidencia política."
      },
      stack: { title: "Stack Tecnológico", tag: "#TechSpecs", content: "Python (GeoPandas), QGIS, React, Mapbox GL JS, Figma." },
      scorecards: {
        rutas: "RUTAS DE CUIDADO", rutas_sub: "Conectando hogares con escuelas y salud",
        conexion: "CONEXIÓN PERIFÉRICA", conexion_sub: "Zona alta de difícil acceso",
        viajes: "VIAJES DE CUIDADO", viajes_sub: "Mujeres e infancias",
        sobrecarga: "SOBRECARGA", sobrecarga_sub: "Necesidad comunitaria vs oferta"
      },
      graphs: {
        demanda: "Dinámica de demanda",
        ascensos: "Ascensos",
        descensos: "Descensos",
        infra: "Infraestructura de cuidados",
        educacion: "Educación",
        salud: "Salud",
        abasto: "Abasto"
      },
      map: {
        simbologia: "SIMBOLOGÍA", recorridos: "Recorridos", isocronas: "Isocronas 500m", equip: "Equipamiento",
        popups: { 
          ruta: "RUTA", demanda: "Demanda", longitud: "Longitud", 
          parada: "PARADA", suben: "Suben", bajan: "Bajan",
          educativo: "EDUCATIVO", salud: "SALUD", abasto: "ABASTO"
        }
      }
    },
    vigilancia: { 
      fileName: "02_vigilancia_espectral", 
      ejecutar: "EJECUTAR ANÁLISIS", 
      title: "VIGILANCIA ESPECTRAL",
      subtitle: "Auditoría de Presión Ambiental y Acceso Costero",
      role: "Segmentación mediante Machine Learning e Índice de Presión del Ecosistema",
      proposito: {
        title: "01. El Propósito", tag: "#EnvironmentalAudit",
        content: "El proyecto consiste en una auditoría ambiental en Dorado, Puerto Rico, para cuantificar el impacto generado por el desarrollo de resorts sobre el ecosistema de manglar. El objetivo es documentar la pérdida de cobertura vegetal y el estado del ecosistema mediante la construcción de un índice de presión, transformando la observación satelital en evidencia técnica para evaluación."
      },
      metodologia: {
        title: "02. Estructura y metodología", tag: "#ML_Methodology",
        intro: "El análisis integra aprendizaje automático y validación multiespectral para garantizar la precisión de los hallazgos:",
        item1Key: "Segmentación Supervisada (Machine Learning):",
        item1Text: "Implementación de un modelo de clasificación supervisada para segmentar el uso de suelo en cuatro categorías: Urbano, Inversión Inmobiliaria (resorts), Manglares y Mar.",
        item2Key: "Validación de Congruencia (NDVI/NDWI):",
        item2Text: "Se generan los índices de vegetación (NDVI) y agua (NDWI) para realizar una validación cruzada con los resultados del modelo de Machine Learning.",
        item3Key: "Cálculo del Índice de Presión del Ecosistema:",
        item3Text: "Desarrollo de una métrica para evaluar el nivel de fragmentación y presión sobre el manglar. Este índice integra la densidad de la infraestructura colindante y la respuesta espectral."
      },
      insights: {
        title: "03. Insights y Visualización", tag: "#Insights",
        intro: "El estudio revela datos críticos sobre la configuración del territorio y plantea una hipótesis sobre la accesibilidad al litoral:",
        item1Key: "Fractura estructural:",
        item1Text: "El análisis revela una alta superficie de inversión inmobiliaria que confirma la mercantilización del suelo.",
        item2Key: "La Hipótesis del Confinamiento:",
        item2Text: "La conjunción de la barrera arquitectónica y natural puede estar anulando el acceso público a las playas garantizado por ley.",
        item3Key: "Dashboard de Auditoría:",
        item3Text: "Visualización interactiva que permite contrastar el modelo de segmentación con los índices de presión ambiental."
      },
      stack: { title: "Stack Tecnológico", tag: "#TechSpecs", content: "Python (Scikit-learn, GeoPandas), Google Earth Engine, SNAP, Mapbox GL JS, Figma." }, // <- ¡AQUÍ FALTABA LA COMA!
      raster: {
        ndviTitle: "Índice de vegetación de diferencia normalizada",
        ndviTop: "Alta Vegetación",
        ndwiTitle: "Índice de humedad de diferencia normalizada",
        ndwiTop: "Alta Humedad"
      },
      scorecards: {
        presion: "ECOSISTEMA PRESIONADO",
        presion_sub: "Conflicto directo",
        amenaza: "ÍNDICE DE AMENAZA",
        amenaza_sub: "% del ecosistema bajo presión",
        inversion: "INVERSIÓN INMOBILIARIA",
        inversion_sub: "Desarrollos proyectados",
        manglar: "SUPERFICIE MANGLAR",
        manglar_sub: "Cobertura vegetal base"
      },
      map: {
        simbologia: "SIMBOLOGÍA",
        manglar: "Manglar",
        inversion: "Inversión Inmobiliaria",
        presion: "Zona del manglar en presión"
      }
    },
    algoritmo: { 
      fileName: "03_algoritmo_inmobiliario", 
      ejecutar: "EJECUTAR ANÁLISIS", 
      title: "ALGORITMO INMOBILIARIO",
      cardDescription1: "Intelligence de Mercado: Análisis cuantitativo de la dinámica de la plataforma de hospedaje en Hong Kong para tangibilizar la financiarización de la vivienda en entornos de hiperdensidad.",
      cardDescription2: "A través de SQL (PostgreSQL) y Python, se modelan datos masivos para identificar clústeres de especulación y el volumen de stock habitacional transformado en activos financieros."
    },
    factorEsfuerzo: { 
      fileName: "04_factor_esfuerzo_turistico", 
      ejecutar: "EJECUTAR ANÁLISIS", 
      title: "FACTOR DE ESFUERZO",
      cardDescription1: "Data Analysis: Modelado de proximidad y fragmentación territorial en la red ferroviaria japonesa para cuantificar el 'Costo Oculto' de la eficiencia del Shinkansen.",
      cardDescription2: "Este proyecto mide la desigualdad de acceso mediante la minería de datos espaciales, evaluando el esfuerzo físico necesario para conectar con el patrimonio regional desconectado de la red principal."
    },
    contacto: {
      rolDestinatario: "Rocío Izunza - Urbanista|Analista de Datos Geoespaciales",
      title: "formulario_contacto",
      destinatario: "destinatario:",
      remitente: "remitente:",
      remitentePlaceholder: "tu nombre",
      correo: "correo:",
      correoPlaceholder: "usuario@email.com",
      asunto: "asunto:",
      asuntoPlaceholder: "Propuesta de colaboración...",
      mensaje: "mensaje:",
      mensajePlaceholder: "Escribe los detalles aquí...",
      exito: "¡mensaje enviado con éxito!",
      error: "error al enviar. intenta de nuevo.",
      btnEnviar: ">enviar_mensaje",
      btnEnviando: "enviando..."
    }
  },
  en: {
    nav: { proyectos: "Projects", formacion: "Specialization", Sobre_Mi: "About_Me", contacto: "Contact" },
    hero: {
      archivoPy: "professional_profile.py",
      clase: "Urban_Planner", 
      subclase: "Data_Scientist",
      bio: "I decode the city through data science. I write code so that urban planning stops relying on intuition and starts listening, with evidence, to the people who inhabit the territory.",
      perfilLabel: "Geospatial Data Analyst",
      cta: "CONTACT",
      cvBtn: "DOWNLOAD_CV"
    },
    formacion: {
      titulo: "Technical Specialization",
      especialidades: "Specializations",
      formaciones: "Certifications",
      cursos: "Completed Courses",
      horas: "Total Hours"
    },
    viajaSegura: {
      fileName: "01_safe_journey",
      ejecutar: "RUN ANALYSIS",
      cardDescription1: "Converting analog transit records from Mexico City's southern periphery into structured data for technical service validation.",
      cardDescription2: "The analysis utilizes ETL workflows and GIS modeling to link mobility patterns with urban care facilities, providing data-driven evidence for strategic planning.",
      subtitle: "CARE-BASED MOBILITY",
      title: "SAFE JOURNEY",
      role: "Transit service legitimation through geospatial evidence",
      proposito: {
        title: "01. Purpose", tag: "#DataDrivenLegitimacy",
        content: "The project evaluates the operation of 'Route 66', an exclusive service for women and children in CDMX's southern periphery. The challenge involved translating analog social operations into a structured data model to support its relevance before SEMOVI. The goal was to build the operational groundwork required to legitimize the model and project its expansion via technical evidence."
      },
      metodologia: {
        title: "02. Structure & Methodology", tag: "#DataEngineering_GIS",
        etlKey: "Data Engineering (ETL):",
        etlText: "Design of digital capture instruments to normalize boarding records. Python (GeoPandas) is used for data cleaning and structuring the primary database, resolving georeferencing inconsistencies.",
        spatialKey: "Advanced Spatial Modeling:",
        spatialText: "In GIS, accessibility models were generated using 500m walking isochrones. The analysis automates the overlap of transit supply with care infrastructure, correlating high-flow nodes with facility locations."
      },
      insights: {
        title: "03. Insights & Visualization", tag: "#TheProduct",
        intro: "The result is a tool that transforms coordinates and raw data into strategic decisions:",
        ejeKey: "Integration Axis:",
        ejeText: "Connects high-altitude peripheries (Oyamel, Ocotal, Antigua) with regional hubs like Ciudad Universitaria.",
        valKey: "Demand Validation:",
        valText: "Legitimation of the route as a vital link in the care mobility network.",
        visKey: "Impact Visualization:",
        visText: "Interactive dashboard highlighting the care economy for political advocacy."
      },
      stack: { title: "Tech Stack", tag: "#TechSpecs", content: "Python (GeoPandas), QGIS, React, Mapbox GL JS, Figma." },
      scorecards: {
        rutas: "CARE ROUTES", rutas_sub: "Connecting homes with schools and health services",
        conexion: "PERIPHERAL CONNECTION", conexion_sub: "Difficult-access high-altitude areas",
        viajes: "CARE TRIPS", viajes_sub: "Women and children",
        sobrecarga: "OVERLOAD", sobrecarga_sub: "Community need vs current supply"
      },
      graphs: {
        demanda: "Demand dynamics",
        ascensos: "Boardings",
        descensos: "Alightings",
        infra: "Care infrastructure",
        educacion: "Education",
        salud: "Health",
        abasto: "Supplies"
      },
      map: {
        simbologia: "SYMBOLOGY", recorridos: "Routes", isocronas: "500m Isochrones", equip: "Equipment",
        popups: { 
          ruta: "ROUTE", demanda: "Demand", longitud: "Length", 
          parada: "STOP", suben: "Boardings", bajan: "Alightings",
          educativo: "EDUCATION", salud: "HEALTH", abasto: "SUPPLIES"
        }
      }
    },
    vigilancia: { 
      fileName: "02_spectral_watch", 
      ejecutar: "RUN ANALYSIS", 
      title: "SPECTRAL WATCH",
      subtitle: "Environmental Pressure & Coastal Access Audit",
      role: "Machine Learning Segmentation & Ecosystem Pressure Index",
      proposito: {
        title: "01. Purpose", tag: "#EnvironmentalAudit",
        content: "The project consists of an environmental audit in Dorado, Puerto Rico, to quantify the impact generated by resort development on the mangrove ecosystem. The goal is to document vegetation loss and ecosystem health by building a pressure index, transforming satellite observation into technical evidence for evaluation."
      },
      metodologia: {
        title: "02. Structure & Methodology", tag: "#ML_Methodology",
        intro: "The analysis integrates machine learning and multispectral validation to ensure finding accuracy:",
        item1Key: "Supervised Segmentation (Machine Learning):",
        item1Text: "Implementation of a supervised classification model to segment land use into four categories: Urban, Real Estate Investment (resorts), Mangroves, and Sea.",
        item2Key: "Consistency Validation (NDVI/NDWI):",
        item2Text: "Vegetation (NDVI) and water (NDWI) indices are generated to perform a cross-validation with the Machine Learning model results.",
        item3Key: "Ecosystem Pressure Index Calculation:",
        item3Text: "Development of a metric to evaluate the level of fragmentation and pressure on the mangrove. This index integrates surrounding infrastructure density and spectral response."
      },
      insights: {
        title: "03. Insights & Visualization", tag: "#Insights",
        intro: "The study reveals critical data on territory configuration and raises a hypothesis on coastal accessibility:",
        item1Key: "Structural Fracture:",
        item1Text: "The analysis reveals a high surface area of real estate investment, confirming land commodification.",
        item2Key: "The Confinement Hypothesis:",
        item2Text: "The combination of architectural and natural barriers may be nullifying public access to beaches guaranteed by law.",
        item3Key: "Audit Dashboard:",
        item3Text: "Interactive visualization that allows contrasting the segmentation model with environmental pressure indices."
      },
      stack: { title: "Tech Stack", tag: "#TechSpecs", content: "Python (Scikit-learn, GeoPandas), Google Earth Engine, SNAP, Mapbox GL JS, Figma." }, // <- ¡AQUÍ FALTABA LA COMA!
      raster: {
        ndviTitle: "Normalized Difference Vegetation Index",
        ndviTop: "High Vegetation",
        ndwiTitle: "Normalized Difference Water Index",
        ndwiTop: "High Moisture"
      },
      scorecards: {
        presion: "PRESSURED ECOSYSTEM",
        presion_sub: "Direct conflict",
        amenaza: "THREAT INDEX",
        amenaza_sub: "% of ecosystem under pressure",
        inversion: "REAL ESTATE INVESTMENT",
        inversion_sub: "Projected developments",
        manglar: "MANGROVE SURFACE",
        manglar_sub: "Baseline vegetation cover"
      },
      map: {
        simbologia: "SYMBOLOGY",
        manglar: "Mangrove",
        inversion: "Real Estate Investment",
        presion: "Pressured mangrove zone"
      }
    },
    algoritmo: { 
      fileName: "03_real_estate_algorithm", 
      ejecutar: "RUN ANALYSIS", 
      title: "REAL ESTATE ALGORITHM",
      cardDescription1: "Market Intelligence: Quantitative analysis of short-term rental dynamics in Hong Kong to visualize housing financialization within hyper-dense environments.",
      cardDescription2: "Using SQL (PostgreSQL) and Python to model massive datasets, identifying speculation clusters and housing stock transformed into liquid financial assets."
    },
    factorEsfuerzo: { 
      fileName: "04_effort_factor_analysis", 
      ejecutar: "RUN ANALYSIS", 
      title: "EFFORT FACTOR",
      cardDescription1: "Data Analysis: Proximity and territorial fragmentation modeling within the Japanese rail network to quantify the 'Hidden Cost' of Shinkansen efficiency.",
      cardDescription2: "This project measures access inequality through spatial data mining, evaluating the physical effort required to reach regional heritage sites disconnected from the main network."
    },
    contacto: {
      rolDestinatario: "Rocío Izunza - Urban Planner|Geospatial Data Analyst",
      title: "contact_form",
      destinatario: "recipient:",
      remitente: "sender:",
      remitentePlaceholder: "your name",
      correo: "email:",
      correoPlaceholder: "user@email.com",
      asunto: "subject:",
      asuntoPlaceholder: "Collaboration proposal...",
      mensaje: "message:",
      mensajePlaceholder: "Write the details here...",
      exito: "message sent successfully!",
      error: "error sending. please try again.",
      btnEnviar: ">send_message",
      btnEnviando: "sending..."
    }
  }
};