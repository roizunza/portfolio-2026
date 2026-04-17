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
      cardComment: "// Auditoría de Datos Ambientales y ML",
      cardDescription1: "Machine Learning: Auditoría ambiental mediante clasificación supervisada de imágenes satelitales para cuantificar la presión antrópica sobre ecosistemas de manglar en Dorado, Puerto Rico.",
      cardDescription2: "El análisis utiliza índices multiespectrales (NDVI/NDWI) para validar la integridad de la segmentación y evidencia el confinamiento del litoral mediante modelado geoespacial avanzado.",
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
      stack: { title: "Stack Tecnológico", tag: "#TechSpecs", content: "Python (Scikit-learn, GeoPandas), Google Earth Engine, SNAP, Mapbox GL JS, Figma." },
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
      subtitle: "INTELIGENCIA DE MERCADO",
      role: "Análisis cuantitativo de la dinámica de plataforma de hospedaje en entornos de hiperdensidad.",
      cardDescription1: "Intelligence de Mercado: Análisis cuantitativo de la dinámica de la plataforma de hospedaje en Hong Kong para tangibilizar la financiarización de la vivienda en entornos de hiperdensidad.",
      cardDescription2: "A través de SQL (PostgreSQL) y Python, se modelan datos masivos para identificar clústeres de especulación y el volumen de stock habitacional transformado en activos financieros.",
      proposito: {
        title: "01. El Propósito", tag: "#BigDataAnalysis",
        content: "El proyecto analiza la operación de la plataforma airbnb en su apartado de renta a corto plazo en Hong Kong, territorio definido por su hiperdensidad y su rol central en las finanzas globales. El objetivo es tangibilizar cómo la dinámica de la plataforma contribuye a la financiarización de la vivienda, reconfigurando las reglas de acceso urbano y transformando el stock habitacional en activos financieros líquidos mediante el análisis de datos masivos."
      },
      metodologia: {
        title: "02. Estructura y metodología", tag: "#DataEngineering",
        intro: "Se implementa un flujo de trabajo de ingeniería de datos para procesar y modelar información unificada proveniente de Inside Airbnb:",
        item1Key: "Limpieza y Gestión de Datos (SQL):",
        item1Text: "Se utiliza PostgreSQL para la ingesta y depuración de los datasets unificados. Se ejecutan consultas para el filtrado de outliers, normalización de tipos de datos y eliminación de registros inconsistentes.",
        item2Key: "Procesamiento Geoespacial (Python):",
        item2Text: "Mediante el empleo de Python (GeoPandas) y la librería SQLAlchemy, se extraen los datos limpios para ejecutar agregaciones espaciales por distrito y calcular métricas críticas de rotación.",
        item3Key: "Normalización de Métricas:",
        item3Text: "Desarrollo de algoritmos para estandarizar indicadores de presión habitacional, permitiendo una comparativa consistente."
      },
      insights: {
        title: "03. Insights y Visualización", tag: "#MarketInsights",
        intro: "El análisis permite identificar una fractura estructural en el mercado de vivienda mediante métricas de alta precisión:",
        item1Key: "Stock Mercantilizado:",
        item1Text: "Cuantificación de unidades extraídas del mercado tradicional que superan la capacidad local.",
        item2Key: "Clústeres de Especulación:",
        item2Text: "Revelación de zonas de alta intensidad en Yau Tsim Mong y Central & Western.",
        item3Key: "Visualización de Datos:",
        item3Text: "Cartografía temática que correlaciona precio con disponibilidad."
      },
      stack: { title: "Stack Tecnológico", tag: "#TechSpecs", content: "Python (GeoPandas, SQLAlchemy), SQL (PostgreSQL), QGIS, Figma." },
      scorecards: {
        stock: "STOCK MERCANTILIZADO",
        stock_sub: "Viviendas extraídas del mercado",
        barrera: "BARRERA DE ACCESO",
        barrera_sub: "Costo promedio por noche",
        subutilizacion: "SUBUTILIZACIÓN",
        subutilizacion_sub: "Días/Año de suelo vacío",
        rotacion: "PRESIÓN DE ROTACIÓN",
        rotacion_sub: "Intensidad de recambio"
      },
      graphs: {
        scatterTitle: "Especulación: Precio vs. Rotación",
        altaPresion: "Alta Presión",
        estandar: "Estándar",
        precio: "Precio",
        rotacion: "Rotación",
        stockTooltip: "Stock",
        unidades: "u.",
        barTitle: "Absorción por Distrito",
        unidadesAirbnb: "Unidades Airbnb",
        unidadesTooltip: "Unidades:"
      },
      map: {
        simbologia: "SIMBOLOGÍA",
        subPrecioDistrito: "Precio Promedio/Distrito(HK$)",
        subPrecioUnidad: "Precio Unidad (HK$)",
        popupUnidad: "UNIDAD AIRBNB",
        popupDistrito: "DISTRITO: ",
        popupPrecioHKD: "Precio HKD:",
        popupPrecioUSD: "Precio USD:"
      }
    },
    factorEsfuerzo: { 
      fileName: "04_factor_esfuerzo_turistico", 
      ejecutar: "EJECUTAR ANÁLISIS", 
      title: "FACTOR DE ESFUERZO",
      subtitle: "ACCESIBILIDAD EN LA RED FERROVIARIA",
      role: "Modelado de proximidad y fragmentación territorial mediante minería de datos",
      cardDescription1: "Data Analysis: Modelado de proximidad y fragmentación territorial en la red ferroviaria japonesa para cuantificar el 'Costo Oculto' de la eficiencia del Shinkansen.",
      cardDescription2: "Este proyecto mide la desigualdad de acceso mediante la minería de datos espaciales, evaluando el esfuerzo físico necesario para conectar con el patrimonio regional desconectado de la red principal.",
      proposito: {
        title: "01. El Propósito", tag: "#GeospatialAnalysis",
        content: "El proyecto evalúa la relación espacial entre la red ferroviaria japonesa y los activos culturales regionales. El objetivo es cuantificar la desigualdad de acceso que experimentan los puntos de interés (POI) no integrados a los nodos principales, determinando el Factor de Esfuerzo: la distancia física que un usuario debe invertir desde la estación más cercana hasta el destino cultural."
      },
      metodologia: {
        title: "02. Estructura y metodología", tag: "#DataMining",
        item1Key: "Minería de Datos (POIs):",
        item1Text: "Desarrollo de scripts en Python (BeautifulSoup) para el web scraping de sitios especializados, normalizando coordenadas y atributos de activos estratégicos en un dataset estructurado.",
        item2Key: "Extracción de Infraestructura:",
        item2Text: "Captura y filtrado automatizado de la red ferroviaria completa de Japón mediante plugins geoespaciales para su integración en el modelo de accesibilidad.",
        item3Key: "Near Analysis:",
        item3Text: "Ejecución de un análisis de proximidad en GIS para categorizar el nivel de dificultad de acceso y el aislamiento relativo de los activos periféricos."
      },
      insights: {
        title: "03. Insights y visualización", tag: "#IsolationMetrics",
        item1Key: "Centralización:",
        item1Text: "Se identifica que la infraestructura prioriza nodos comerciales densos, aumentando críticamente el esfuerzo para acceder al patrimonio histórico.",
        item2Key: "Métricas de Última Milla:",
        item2Text: "Detección de clústeres donde el esfuerzo de traslado excede los radios de caminabilidad estándar (1km), evidenciando brechas de conectividad.",
        item3Key: "Cartografía:",
        item3Text: "Visualización temática que correlaciona la densidad de estaciones con la ubicación de POIs para la toma de decisiones territoriales."
      },
      stack: { title: "Stack Tecnológico", tag: "#TechSpecs", content: "Python (BeautifulSoup, Pandas), QGIS (QuickOSM), Figma." },
      scorecards: {
        activos: "ACTIVOS MAPEADOS",
        activos_sub: "Puntos de interés cultural",
        esfuerzo: "FACTOR ESFUERZO",
        esfuerzo_sub: "Distancia promedio a red",
        aislamiento: "ÍNDICE DE AISLAMIENTO",
        aislamiento_sub: "Activos fuera de radio peatonal",
        conexion: "NODOS CONECTADOS",
        conexion_sub: "Acceso directo (<500m)",
        km: " km"
      },
      graphs: {
        distribucion: "Distribución de Accesibilidad",
        aislados: "Top 5 Activos Aislados (km)",
        distLabel: "Distancia",
        countLabel: "Cantidad",
        sinNombre: "Sin Nombre",
        buckets: {
          bajo: "< 500m",
          medio: "500m-1km",
          alto: "1km-3km",
          critico: "> 3km"
        }
      },
      map: {
        simbologia: "SIMBOLOGÍA",
        turismo: "Turismo",
        activo: "Activo Turístico (Punto)",
        buffer: "Buffer de Influencia",
        esfuerzo: "Factor Esfuerzo",
        distancia: "Distancia a Estación",
        red: "Red Ferroviaria",
        estacion: "Estación Tren",
        vias: "Vías",
        popupActivo: "ACTIVO TURÍSTICO",
        popupEstacion: "ESTACIÓN",
        popupRed: "DISTANCIA A RED",
        metros: "metros"
      }
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
    }, 
    outro: {
      log_completed: ">PROCESO_COMPLETADO: 100%",
      log_analyzing: "> ANALIZANDO_SIGUIENTE_PASO...",
      titulo: "LISTA PARA CODIFICAR LA SIGUIENTE CIUDAD",
      tab: "info_extra",
      perfil: "Urbanista & Analista de Datos Geoespaciales",
      status: "Online & Lista",
      layers: "'Infraestructura', 'Data', 'Género', 'Ambiente'",
      btn: "CONTACTO"
    }
  },
  en: {
    nav: { proyectos: "Projects", formacion: "Training", Sobre_Mi: "About_Me", contacto: "Contact" },
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
      cardComment: "// Environmental Data Auditing & ML",
      cardDescription1: "Machine Learning: Environmental auditing via supervised satellite imagery classification to quantify anthropogenic pressure on mangrove ecosystems in Dorado, Puerto Rico.",
      cardDescription2: "The analysis employs multispectral indices (NDVI/NDWI) to validate segmentation integrity and demonstrates coastal confinement through advanced geospatial modeling.",
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
      stack: { title: "Tech Stack", tag: "#TechSpecs", content: "Python (Scikit-learn, GeoPandas), Google Earth Engine, SNAP, Mapbox GL JS, Figma." },
      raster: {
        ndviTitle: "Normalized Difference Vegetation Index",
        ndviTop: "High Vegetation",
        ndwiTitle: "Normalized Difference Water Index",
        ndwiTop: "High Moisture"
      },
      scorecards: {
        presion: "PRESSURED ECOSYSTEM",
        presion_sub: "Direct conflict",
        threat: "THREAT INDEX",
        threat_sub: "% of ecosystem under pressure",
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
      subtitle: "MARKET INTELLIGENCE",
      role: "Quantitative analysis of short-term rental dynamics in hyper-dense environments.",
      cardDescription1: "Market Intelligence: Quantitative analysis of short-term rental dynamics in Hong Kong to visualize housing financialization within hyper-dense environments.",
      cardDescription2: "Using SQL (PostgreSQL) and Python to model massive datasets, identifying speculation clusters and housing stock transformed into liquid financial assets.",
      proposito: {
        title: "01. Purpose", tag: "#BigDataAnalysis",
        content: "The project analyzes the short-term rental operations of the Airbnb platform in Hong Kong, a territory defined by its hyper-density and its central role in global finance. The goal is to make tangible how the platform's dynamics contribute to housing financialization, reconfiguring urban access rules and transforming the housing stock into liquid financial assets through big data analysis."
      },
      metodologia: {
        title: "02. Structure & Methodology", tag: "#DataEngineering",
        intro: "A data engineering workflow is implemented to process and model unified information from Inside Airbnb:",
        item1Key: "Data Cleaning & Management (SQL):",
        item1Text: "PostgreSQL is used for the ingestion and debugging of unified datasets. Queries are executed to filter outliers, normalize data types, and eliminate inconsistent records.",
        item2Key: "Geospatial Processing (Python):",
        item2Text: "Using Python (GeoPandas) and the SQLAlchemy library, clean data is extracted to execute spatial aggregations by district and calculate critical turnover metrics.",
        item3Key: "Metric Normalization:",
        item3Text: "Development of algorithms to standardize housing pressure indicators, allowing for consistent comparison."
      },
      insights: {
        title: "03. Insights & Visualization", tag: "#MarketInsights",
        intro: "The analysis identifies a structural fracture in the housing market through high-precision metrics:",
        item1Key: "Commodified Stock:",
        item1Text: "Quantification of units extracted from the traditional market that exceed local capacity.",
        item2Key: "Speculation Clusters:",
        item2Text: "Revelation of high-intensity zones in Yau Tsim Mong and Central & Western.",
        item3Key: "Data Visualization:",
        item3Text: "Thematic cartography correlating price with availability."
      },
      stack: { title: "Tech Stack", tag: "#TechSpecs", content: "Python (GeoPandas, SQLAlchemy), SQL (PostgreSQL), QGIS, Figma." },
      scorecards: {
        stock: "COMMODIFIED STOCK",
        stock_sub: "Housing extracted from the market",
        barrera: "ACCESS BARRIER",
        barrera_sub: "Average cost per night",
        subutilizacion: "UNDERUTILIZATION",
        subutilizacion_sub: "Days/Year of vacant property",
        rotation: "TURNOVER PRESSURE",
        rotation_sub: "Turnover intensity"
      },
      graphs: {
        scatterTitle: "Speculation: Price vs. Turnover",
        highPressure: "High Pressure",
        standard: "Standard",
        price: "Price",
        rotation: "Turnover",
        stockTooltip: "Stock",
        units: "u.",
        barTitle: "Absorption by District",
        unitsAirbnb: "Airbnb Units",
        unitsTooltip: "Units:"
      },
      map: {
        simbologia: "SYMBOLOGY",
        subPriceDistrito: "Avg. Price/District(HK$)",
        subPriceUnidad: "Unit Price (HK$)",
        popupUnidad: "AIRBNB UNIT",
        popupDistrito: "DISTRICT: ",
        popupPrecioHKD: "Price HKD:",
        popupPrecioUSD: "Price USD:"
      }
    },
    factorEsfuerzo: { 
      fileName: "04_effort_factor_analysis", 
      ejecutar: "RUN ANALYSIS", 
      title: "EFFORT FACTOR",
      subtitle: "RAILWAY NETWORK ACCESSIBILITY",
      role: "Proximity and territorial fragmentation modeling through data mining",
      cardDescription1: "Data Analysis: Proximity and territorial fragmentation modeling within the Japanese rail network to quantify the 'Hidden Cost' of Shinkansen efficiency.",
      cardDescription2: "This project delivers a spatial data mining model to identify accessibility gaps in historical heritage sites disconnected from primary railway hubs.",
      proposito: {
        title: "01. Purpose", tag: "#GeospatialAnalysis",
        content: "The project evaluates the spatial relationship between the Japanese railway network and regional cultural assets. The goal is to quantify the access inequality experienced by points of interest (POIs) not integrated into main nodes, determining the Effort Factor: the physical distance a user must invest from the nearest station to the cultural destination."
      },
      metodologia: {
        title: "02. Structure & Methodology", tag: "#DataMining",
        item1Key: "Data Mining (POIs):",
        item1Text: "Development of Python scripts (BeautifulSoup) for web scraping specialized sites, normalizing coordinates and attributes of strategic assets into a structured dataset.",
        item2Key: "Infrastructure Extraction:",
        item2Text: "Automated capture and filtering of the entire Japanese railway network using geospatial plugins for integration into the accessibility model.",
        item3Key: "Near Analysis:",
        item3Text: "Execution of a proximity analysis in GIS to categorize the difficulty level of access and the relative isolation of peripheral assets."
      },
      insights: {
        title: "03. Insights & Visualization", tag: "#IsolationMetrics",
        item1Key: "Centralization:",
        item1Text: "It is identified that the infrastructure prioritizes dense commercial nodes, critically increasing the effort to access historical heritage.",
        item2Key: "Last-Mile Metrics:",
        item2Text: "Detection of clusters where travel effort exceeds standard walkability radii (1km), highlighting connectivity gaps.",
        item3Key: "Cartography:",
        item3Text: "Thematic visualization correlating station density with POI locations for territorial decision-making."
      },
      stack: { title: "Tech Stack", tag: "#TechSpecs", content: "Python (BeautifulSoup, Pandas), QGIS (QuickOSM), Figma." },
      scorecards: {
        assets: "MAPPED ASSETS",
        assets_sub: "Cultural points of interest",
        effort: "EFFORT FACTOR",
        effort_sub: "Average distance to network",
        isolation: "ISOLATION INDEX",
        isolation_sub: "Assets outside pedestrian radius",
        connection: "CONNECTED NODES",
        connection_sub: "Direct access (<500m)",
        km: " km"
      },
      graphs: {
        distribution: "Accessibility Distribution",
        isolated: "Top 5 Isolated Assets (km)",
        distLabel: "Distance",
        countLabel: "Count",
        noName: "Unnamed",
        buckets: {
          low: "< 500m",
          med: "500m-1km",
          high: "1km-3km",
          crit: "> 3km"
        }
      },
      map: {
        simbologia: "SYMBOLOGY",
        tourism: "Tourism",
        asset: "Tourist Asset (Point)",
        buffer: "Influence Buffer",
        effort: "Effort Factor",
        distance: "Distance to Station",
        network: "Railway Network",
        station: "Train Station",
        tracks: "Tracks",
        popupAsset: "TOURIST ASSET",
        popupStation: "STATION",
        popupNetwork: "DISTANCE TO NETWORK",
        meters: "meters"
      }
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
    },
    outro: {
      log_completed: ">PROCESS_COMPLETED: 100%",
      log_analyzing: "> ANALYZING_NEXT_STEP...",
      titulo: "READY TO CODE THE NEXT CITY",
      tab: "extra_info",
      perfil: "Urban Planner & Geospatial Data Analyst",
      status: "Online & Ready",
      layers: "'Infrastructure', 'Data', 'Gender', 'Environment'",
      btn: "CONTACT"
    }
  }
};