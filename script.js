// script.js - SOLO MODIFICADA LA FUNCIÓN saveAsPDF()

// Variables globales
let currentSection = 1;
const totalSections = 13;

// PESOS AJUSTADOS: Fugas (15%) y Motor (15%) tienen más peso
const sectionWeights = {
    1: 5,   // Datos del vehículo
    2: 10,  // Documentación
    3: 10,  // Valores comerciales
    4: 15,  // Fuga de fluidos - AUMENTADO
    5: 10,  // Sistema eléctrico
    6: 10,  // Inspección visual
    7: 15,  // Estado del motor - AUMENTADO
    8: 10,  // Llantas
    9: 10,  // Tren delantero
    10: 10, // Interior
    11: 5,  // Accesorios
    12: 5   // Prueba de ruta
};

// Preguntas para cada sección
const sectionQuestions = {
    2: [
        { id: "soat", text: "SOAT vigente" },
        { id: "propertyCard", text: "Tarjeta de propiedad" },
        { id: "accidentsReported", text: "Reporta siniestros" },
        { id: "techReview", text: "Rev. Tecnomecánica" },
        { id: "hasInsurance", text: "Aseguradora" }
    ],
    4: [
        { id: "engineOilLeak", text: "Fuga de aceite motor" },
        { id: "transmissionOilLeak", text: "Fuga de aceite caja" },
        { id: "coolantLeak", text: "Fuga de refrigerante" },
        { id: "brakeFluidLeak", text: "Fuga de líquido de freno" },
        { id: "powerSteeringLeak", text: "Fuga de dirección hidráulica" },
        { id: "differentialLeak", text: "Fuga de diferencial" }
    ],
    5: [
        { id: "frontWindshield", text: "Panorámico delantero" },
        { id: "rearWindshield", text: "Panorámico trasero" },
        { id: "windows", text: "Vidrios" },
        { id: "wipers", text: "Plumillas" },
        { id: "rightHeadlight", text: "Farola derecha" },
        { id: "leftHeadlight", text: "Farola izquierda" },
        { id: "rightBrakeLight", text: "Stop derecho" },
        { id: "leftBrakeLight", text: "Stop izquierdo" },
        { id: "horn", text: "Bocina" },
        { id: "battery", text: "Batería" },
        { id: "fuses", text: "Fusibles" },
        { id: "alternator", text: "Alternador" }
    ],
    6: [
        { id: "leftFender", text: "Guardafango izquierdo trasero" },
        { id: "rightFender", text: "Guardafango derecho trasero" },
        { id: "rightSide", text: "Guardafango izquierdo delantero" },
        { id: "leftSide", text: "Guardafango derecho delantero" },
        { id: "leftRearDoor", text: "Puerta trasera izquierda" },
        { id: "rightRearDoor", text: "Puerta trasera derecha" },
        { id: "rightFrontDoor", text: "Puerta delantera derecha" },
        { id: "leftFrontDoor", text: "Puerta delantera izquierda" },
        { id: "rightRunningBoard", text: "Estribo derecho delantero" },
        { id: "hood", text: "Capo" },
        { id: "leftRunningBoard", text: "Estribo izquierdo delantero" },
        { id: "rightRearRunningBoard", text: "Estribo derecho trasero" },
        { id: "frontBumper", text: "Defensa delantera" },
        { id: "rearBumper", text: "Defensa trasera" },
        { id: "roof", text: "Techo" }
    ],
    7: [
        { id: "cylinderCompression", text: "Compresión por cilindro" },
        { id: "obdScan", text: "Escaneo OBD-II" }
    ],
    8: [
        { id: "frontTires", text: "Llantas delanteras" },
        { id: "rearTires", text: "Llantas traseras" },
        { id: "spareTire", text: "Llanta de repuesto" },
        { id: "tireWear", text: "Desgaste" },
        { id: "rimsCondition", text: "Estado de rines" }
    ],
    9: [
        { id: "brakePads", text: "Pastillas de freno" },
        { id: "brakeDiscs", text: "Discos de freno" },
        { id: "frontShocks", text: "Amortiguadores delanteros" },
        { id: "rearShocks", text: "Amortiguadores traseros" },
        { id: "axleTips", text: "Puntas de ejes" },
        { id: "axles", text: "Axiales" },
        { id: "terminals", text: "Terminales" },
        { id: "ballJoints", text: "Rotulas" },
        { id: "bushings", text: "Bujes" },
        { id: "controlArms", text: "Tijeras" },
        { id: "steeringBox", text: "Caja de dirección" },
        { id: "bearings", text: "Rodamientos" },
        { id: "chassis", text: "Chasís" }
    ],
    10: [
        { id: "heating", text: "Calefacción" },
        { id: "ac", text: "Aire acondicionado" },
        { id: "radio", text: "Radio" },
        { id: "alarm", text: "Alarma" },
        { id: "upholstery", text: "Tapicería" },
        { id: "dashboard", text: "Tablero" },
        { id: "dashboardLights", text: "Luces tablero" },
        { id: "interiorLights", text: "Luces interiores" },
        { id: "seatBelts", text: "Cinturones de seguridad" },
        { id: "mirrors", text: "Espejos" },
        { id: "powerWindows", text: "Elevavidrios" },
        { id: "locks", text: "Seguros" }
    ],
    11: [
        { id: "speakers", text: "Parlantes" },
        { id: "powerPlant", text: "Planta" },
        { id: "steeringWheel", text: "Timón o volante" },
        { id: "luxuryRims", text: "Rines de lujo" },
        { id: "safetyFilm", text: "Película de seguridad" }
    ],
    12: [
        { id: "acceleration", text: "Aceleración" },
        { id: "handling", text: "Maniobrabilidad" },
        { id: "alignment", text: "Angulo de alineación" },
        { id: "braking", text: "Condición de frenado" },
        { id: "clutch", text: "Condición de embrague" },
        { id: "gearboxEngine", text: "Relación caja-motor" },
        { id: "vibrations", text: "Vibraciones" }
    ]
};

// Función para obtener la fecha y hora actual formateada
function getCurrentDateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    return now.toLocaleString('es-CO', options);
}

// Función para navegar entre secciones
function nextSection(sectionNumber) {
    document.getElementById(`section-${currentSection}`).classList.remove('active');
    document.getElementById(`section-${sectionNumber}`).classList.add('active');
    currentSection = sectionNumber;
    
    // Actualizar barra de progreso
    const progress = (sectionNumber / totalSections) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

// Función para volver al formulario desde el informe
function backToForm() {
    if (confirm('¿Está seguro de que desea volver al formulario? Perderá el informe actual y podrá corregir los datos.')) {
        document.getElementById('finalReport').style.display = 'none';
        document.getElementById('evaluationForm').style.display = 'block';
        document.getElementById('finalReport').innerHTML = '';
        window.scrollTo(0, 0);
    }
}

// Función para validar la sección actual
function validateSection(section) {
    let isValid = true;
    
    // Ocultar todos los errores primero
    document.querySelectorAll(`#section-${section} .validation-error`).forEach(error => {
        error.style.display = 'none';
    });
    
    // Validar campos según la sección
    const sectionElement = document.getElementById(`section-${section}`);
    const requiredElements = sectionElement.querySelectorAll('select[required], input[required]');
    
    requiredElements.forEach(element => {
        if (!element.value.trim()) {
            const errorId = `${element.id}Error`;
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.style.display = 'block';
            }
            isValid = false;
            
            // Resaltar campo inválido
            element.style.borderColor = 'var(--bad)';
        } else {
            element.style.borderColor = '#ddd';
        }
    });
    
    // Validaciones específicas por sección
    if (section === 3) {
        // Validar que los valores comerciales sean números válidos
        const marketValue = document.getElementById('marketValue').value;
        const fasecoldaValue = document.getElementById('fasecoldaValue').value;
        const expertValue = document.getElementById('expertValue').value;
        
        if (isNaN(parseFloat(marketValue.replace(/[^0-9.]/g, ''))) || 
            isNaN(parseFloat(fasecoldaValue.replace(/[^0-9.]/g, ''))) || 
            isNaN(parseFloat(expertValue.replace(/[^0-9.]/g, '')))) {
            alert('Los valores comerciales deben ser números válidos');
            isValid = false;
        }
    }
    
    if (section === 13) {
        // Validar al menos una foto
        const photoFront = document.getElementById('photoFront').files.length;
        const photoSide = document.getElementById('photoSide').files.length;
        const photoRear = document.getElementById('photoRear').files.length;
        const photoEngine = document.getElementById('photoEngine').files.length;
        
        if (photoFront === 0 && photoSide === 0 && photoRear === 0 && photoEngine === 0) {
            alert('Por favor suba al menos una foto del vehículo');
            isValid = false;
        }
    }
    
    if (isValid) {
        if (section < totalSections) {
            nextSection(section + 1);
        } else {
            generateReport();
        }
    } else {
        // Scroll al primer error
        const firstError = sectionElement.querySelector('.validation-error[style*="display: block"]');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Función para sanitizar texto (prevenir XSS)
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función para formatear moneda
function formatCurrency(value) {
    if (!value || isNaN(value)) return '$0';
    return new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP', 
        minimumFractionDigits: 0 
    }).format(value);
}

// Función para generar el informe final
function generateReport() {
    // Ocultar formulario y mostrar informe
    document.getElementById('evaluationForm').style.display = 'none';
    document.getElementById('finalReport').style.display = 'block';
    
    // Obtener valores del formulario (sanitizados)
    const vehicleData = {
        class: sanitizeText(document.getElementById('vehicleClass').value),
        brand: sanitizeText(document.getElementById('vehicleBrand').value),
        line: sanitizeText(document.getElementById('vehicleLine').value),
        body: sanitizeText(document.getElementById('vehicleBody').value),
        model: sanitizeText(document.getElementById('vehicleModel').value),
        nationality: sanitizeText(document.getElementById('vehicleNationality').value),
        transmission: sanitizeText(document.getElementById('vehicleTransmission').value),
        engine: sanitizeText(document.getElementById('vehicleEngine').value),
        fuel: sanitizeText(document.getElementById('vehicleFuel').value),
        paint: sanitizeText(document.getElementById('vehiclePaint').value),
        service: sanitizeText(document.getElementById('vehicleService').value),
        mileage: sanitizeText(document.getElementById('vehicleMileage').value),
        color: sanitizeText(document.getElementById('vehicleColor').value),
        chassis: sanitizeText(document.getElementById('vehicleChassis').value),
        serial: sanitizeText(document.getElementById('vehicleSerial').value),
        motor: sanitizeText(document.getElementById('vehicleMotor').value),
        plate: sanitizeText(document.getElementById('vehiclePlate').value)
    };
    
    // Calcular puntajes
    const sectionScores = calculateScores();
    const globalScore = calculateGlobalScore(sectionScores);
    const peritajeDateTime = getCurrentDateTime();
    const reportNumber = Math.floor(Math.random() * 10000);
    
    // Generar HTML del informe
    const reportHTML = `
        <div class="header">
            <div class="header-content">
                <div class="logo-container">
                    <div class="logo-img">LOGO</div>
                    <div class="logo-text">
                        PeritoExpert
                        <span>INFORME DE EVALUACIÓN</span>
                    </div>
                </div>
                <div>
                    <h1 class="report-title">Informe de Inspección Técnica</h1>
                </div>
                <div class="report-number">Peritaje #${reportNumber}</div>
            </div>
        </div>
        
        <div class="peritaje-datetime">
            <i class="fas fa-calendar-alt"></i> Fecha y hora del peritaje: ${peritajeDateTime}
        </div>
        
        <div class="vehicle-display">
            <div class="vehicle-photos">
                <div class="photo-container">
                    <div class="photo-placeholder">
                        <img src="#" id="reportPhotoFront" alt="Foto frontal del vehículo">
                    </div>
                    <div class="photo-label">Foto frontal del vehículo</div>
                </div>
                <div class="photo-container">
                    <div class="photo-placeholder">
                        <img src="#" id="reportPhotoSide" alt="Foto lateral del vehículo">
                    </div>
                    <div class="photo-label">Foto lateral del vehículo</div>
                </div>
                <div class="photo-container">
                    <div class="photo-placeholder">
                        <img src="#" id="reportPhotoRear" alt="Foto trasera del vehículo">
                    </div>
                    <div class="photo-label">Foto trasera del vehículo</div>
                </div>
                <div class="photo-container">
                    <div class="photo-placeholder">
                        <img src="#" id="reportPhotoEngine" alt="Foto del motor">
                    </div>
                    <div class="photo-label">Motor</div>
                </div>
            </div>
            <div class="vehicle-info">
                <h2>Datos del Vehículo</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Clase</div>
                        <div class="info-value">${vehicleData.class}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Marca</div>
                        <div class="info-value">${vehicleData.brand}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Línea</div>
                        <div class="info-value">${vehicleData.line}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Carrocería</div>
                        <div class="info-value">${vehicleData.body}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Modelo</div>
                        <div class="info-value">${vehicleData.model}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Nacionalidad</div>
                        <div class="info-value">${vehicleData.nationality}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Tipo de caja</div>
                        <div class="info-value">${vehicleData.transmission}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Cilindraje</div>
                        <div class="info-value">${vehicleData.engine}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Combustible</div>
                        <div class="info-value">${vehicleData.fuel}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Pintura</div>
                        <div class="info-value">${vehicleData.paint}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Servicio</div>
                        <div class="info-value">${vehicleData.service}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Kilometraje</div>
                        <div class="info-value">${vehicleData.mileage}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Color</div>
                        <div class="info-value">${vehicleData.color}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">No. chasis</div>
                        <div class="info-value">${vehicleData.chassis}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">No. serial</div>
                        <div class="info-value">${vehicleData.serial}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">No. Motor</div>
                        <div class="info-value">${vehicleData.motor}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Placa</div>
                        <div class="info-value">${vehicleData.plate}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Sección de Valores Comerciales -->
        <div class="section commercial-values">
            <h2 class="section-title">Valores Comerciales</h2>
            ${generateCommercialValuesHTML()}
        </div>
        
        <div class="section">
            <h2 class="section-title">Evaluación por Secciones</h2>
            
            <!-- Sección Documentación -->
            <div class="subsection">
                <h3>Documentación</h3>
                <div class="checklist">
                    ${generateChecklistItems(2)}
                </div>
                <div class="score-card">
                    <div class="score-label">Puntuación Documentación</div>
                    <div class="score-value">${sectionScores[2]}%</div>
                    <div class="gauge">
                        <div class="gauge-value" style="left: ${sectionScores[2]}%;" data-value="${sectionScores[2]}"></div>
                    </div>
                </div>
            </div>
            
            <!-- Sección Fuga de fluidos (CRÍTICA) -->
            <div class="subsection">
                <h3>Fuga de fluidos <span style="color: var(--bad); font-size: 14px;">(Sección Crítica)</span></h3>
                <div class="checklist">
                    ${generateChecklistItems(4)}
                </div>
                <div class="score-card">
                    <div class="score-label">Puntuación Fuga de fluidos</div>
                    <div class="score-value">${sectionScores[4]}%</div>
                    <div class="gauge">
                        <div class="gauge-value" style="left: ${sectionScores[4]}%;" data-value="${sectionScores[4]}"></div>
                    </div>
                    <div class="score-label" style="color: ${sectionScores[4] < 70 ? 'var(--bad)' : 'inherit'}">
                        ${sectionScores[4] < 70 ? '⚠️ Sección crítica con baja puntuación' : 'Sección crítica en buen estado'}
                    </div>
                </div>
            </div>
            
            <!-- Sección Sistema Eléctrico -->
            <div class="subsection">
                <h3>Sistema Eléctrico</h3>
                <div class="checklist-full">
                    ${generateChecklistItems(5)}
                </div>
                <div class="score-card">
                    <div class="score-label">Puntuación Sistema Eléctrico</div>
                    <div class="score-value">${sectionScores[5]}%</div>
                    <div class="gauge">
                        <div class="gauge-value" style="left: ${sectionScores[5]}%;" data-value="${sectionScores[5]}"></div>
                    </div>
                </div>
            </div>
            
            <!-- Sección Inspección Visual -->
            <div class="subsection">
                <h3>Inspección Visual y Técnica</h3>
                <div class="checklist-full">
                    ${generateChecklistItems(6)}
                </div>
                <div class="score-card">
                    <div class="score-label">Puntuación Inspección Visual</div>
                    <div class="score-value">${sectionScores[6]}%</div>
                    <div class="gauge">
                        <div class="gauge-value" style="left: ${sectionScores[6]}%;" data-value="${sectionScores[6]}"></div>
                    </div>
                </div>
            </div>
            
            <!-- Sección Estado del Motor (CRÍTICA) -->
            <div class="subsection">
                <h3>Estado del Motor <span style="color: var(--bad); font-size: 14px;">(Sección Crítica)</span></h3>
                <div class="checklist">
                    ${generateChecklistItems(7)}
                </div>
                <div class="score-card">
                    <div class="score-label">Puntuación Estado del Motor</div>
                    <div class="score-value">${sectionScores[7]}%</div>
                    <div class="gauge">
                        <div class="gauge-value" style="left: ${sectionScores[7]}%;" data-value="${sectionScores[7]}"></div>
                    </div>
                    <div class="score-label" style="color: ${sectionScores[7] < 70 ? 'var(--bad)' : 'inherit'}">
                        ${sectionScores[7] < 70 ? '⚠️ Sección crítica con baja puntuación' : 'Sección crítica en buen estado'}
                    </div>
                </div>
            </div>
            
            <!-- Sección Llantas -->
            <div class="subsection">
                <h3>Llantas</h3>
                <div class="checklist">
                    ${generateChecklistItems(8)}
                </div>
                <div class="score-card">
                    <div class="score-label">Puntuación Llantas</div>
                    <div class="score-value">${sectionScores[8]}%</div>
                    <div class="gauge">
                        <div class="gauge-value" style="left: ${sectionScores[8]}%;" data-value="${sectionScores[8]}"></div>
                    </div>
                </div>
            </div>
            
            <!-- Sección Tren Delantero -->
            <div class="subsection">
                <h3>Tren Delantero y Suspensión</h3>
                <div class="checklist-full">
                    ${generateChecklistItems(9)}
                </div>
                <div class="score-card">
                    <div class="score-label">Puntuación Tren Delantero</div>
                    <div class="score-value">${sectionScores[9]}%</div>
                    <div class="gauge">
                        <div class="gauge-value" style="left: ${sectionScores[9]}%;" data-value="${sectionScores[9]}"></div>
                    </div>
                </div>
            </div>
            
            <!-- Sección Interior -->
            <div class="subsection">
                <h3>Interior del Vehículo</h3>
                <div class="checklist-full">
                    ${generateChecklistItems(10)}
                </div>
                <div class="score-card">
                    <div class="score-label">Puntuación Interior</div>
                    <div class="score-value">${sectionScores[10]}%</div>
                    <div class="gauge">
                        <div class="gauge-value" style="left: ${sectionScores[10]}%;" data-value="${sectionScores[10]}"></div>
                    </div>
                </div>
            </div>
            
            <!-- Sección Accesorios -->
            <div class="subsection">
                <h3>Accesorios</h3>
                <div class="checklist">
                    ${generateChecklistItems(11)}
                </div>
                <div class="score-card">
                    <div class="score-label">Puntuación Accesorios</div>
                    <div class="score-value">${sectionScores[11]}%</div>
                    <div class="gauge">
                        <div class="gauge-value" style="left: ${sectionScores[11]}%;" data-value="${sectionScores[11]}"></div>
                    </div>
                </div>
            </div>
            
            <!-- Sección Prueba de Ruta -->
            <div class="subsection">
                <h3>Prueba de Ruta</h3>
                <div class="checklist">
                    ${generateChecklistItems(12)}
                </div>
                <div class="score-card">
                    <div class="score-label">Puntuación Prueba de Ruta</div>
                    <div class="score-value">${sectionScores[12]}%</div>
                    <div class="gauge">
                        <div class="gauge-value" style="left: ${sectionScores[12]}%;" data-value="${sectionScores[12]}"></div>
                    </div>
                </div>
            </div>
            
        </div>
        
        <div class="observations">
            <h3 class="observations-title">Observaciones del Perito</h3>
            <p>${sanitizeText(document.getElementById('observations').value)}</p>
        </div>
        
        <div class="approval-criteria">
            <h3 class="criteria-title">Criterio de Aprobación</h3>
            <div class="criteria-grid">
                <div class="criteria-item approved">
                    <div class="criteria-icon">✓</div>
                    <div class="criteria-text">
                        <strong>Aprobado</strong><br>
                        Puntuación igual o superior al 75%
                    </div>
                </div>
                <div class="criteria-item rejected">
                    <div class="criteria-icon">✗</div>
                    <div class="criteria-text">
                        <strong>No Aprobado</strong><br>
                        Puntuación inferior al 75%
                    </div>
                </div>
            </div>
        </div>
        
        <div class="score-card">
            <div class="score-label">Puntuación Global</div>
            <div class="score-value">${globalScore}%</div>
            <div class="gauge">
                <div class="gauge-value" style="left: ${globalScore}%;" data-value="${globalScore}"></div>
            </div>
            <div class="score-label">
                ${globalScore >= 75 ? 
                    'Vehículo APROBADO según criterios de evaluación' : 
                    'Vehículo NO APROBADO según criterios de evaluación'}
            </div>
        </div>
        
        <div class="signature-area">
            <div class="signature-box">
                <div>Firma del Perito</div>
                <div class="signature-line"></div>
                <div>Nombre: ____________________</div>
                <div>Registro: ___________________</div>
            </div>
            
            <div class="${globalScore >= 75 ? 'approved-stamp' : 'not-approved-stamp'}">
                ${globalScore >= 75 ? 'APROBADO' : 'NO APROBADO'}
            </div>
            
            <div class="signature-box">
                <div>Firma del Cliente</div>
                <div class="signature-line"></div>
                <div>Nombre: ____________________</div>
                <div>CC/NIT: ____________________</div>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-info">
                <div>PERITOEXPERT.COM.CO</div>
                <div>Teléfono: 3007152606</div>
                <div>Email: peritoexpert.bogota@gmail.com</div>
                <div>WEB: www.peritoexpert.com.co</div>
            </div>
            <div>Este informe es confidencial y propiedad de PERITOEXPERT. Su distribución está sujeta a autorización. Este documento tiene vigencia hasta cumplir 15 días después</div>
            <div> de la inspección visual realizada. La evaluación se basa en una inspección visual y pruebas funcionales al momento de la revisión. PERITOEXPERT no se hace responsable</div>
            <div>por fallas mecánicas que se presenten posterior a la inspección.</div>
        </div>
        
        <div class="legal-clauses">
            <!-- DECLARACIONES, AUTORIZACIONES Y CONDICIONES -->
            <div style="margin-bottom: 10px; padding: 8px; border: 1px solid #d1ecf1; background-color: #f8f9fa;">
                <h6 style="font-size: 8.5px; color: var(--f1-red); margin-bottom: 5px; font-weight: bold; text-align: center; text-transform: uppercase;">
                    DECLARACIONES, AUTORIZACIONES Y CONDICIONES DEL SERVICIO
                </h6>
                <p style="font-size: 8.5px; color: #333; margin-bottom: 5px; text-align: center; font-weight: bold;">
                    PERITOEXPERT S.A.S.
                </p>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Declaración de veracidad y procedencia del vehículo</p>
                    <p style="margin: 2px 0; text-align: justify;">Declaro bajo gravedad de juramento que toda la información y documentación suministrada a PERITOEXPERT S.A.S. es veraz, completa y corresponde a la realidad. Así mismo, manifiesto que el vehículo presentado para la inspección es de procedencia lícita. En consecuencia, asumo de manera exclusiva cualquier responsabilidad de tipo penal, civil, administrativa o fiscal que se derive de esta orden de trabajo, eximiendo a PERITOEXPERT de cualquier responsabilidad por información falsa, incompleta u omitida.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Autorización para consulta de información</p>
                    <p style="margin: 2px 0; text-align: justify;">Autorizo expresa e irrevocablemente a PERITOEXPERT para consultar mi información personal y la del vehículo en el Registro Único Nacional de Tránsito (RUNT), así como en otras entidades públicas o privadas afiliadas o relacionadas, con el fin de solicitar, consultar y validar la información del vehículo identificado con la placa consignada en el informe de inspección.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Prestación del servicio</p>
                    <p style="margin: 2px 0; text-align: justify;">PERITOEXPERT. presta al cliente el servicio de peritaje automotriz, el cual puede incluir inspección técnica, validación de asegurabilidad y avalúo comercial referencial, de acuerdo con el alcance contratado y las condiciones establecidas en el presente informe.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Inspección de asegurabilidad</p>
                    <p style="margin: 2px 0; text-align: justify;">La empresa se compromete a realizar la inspección de asegurabilidad del vehículo conforme a los criterios técnicos, protocolos internos y convenios vigentes con las compañías aseguradoras, cuando aplique, aclarando que el dictamen emitido corresponde exclusivamente al estado observable del vehículo al momento de la inspección.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Avalúo comercial</p>
                    <p style="margin: 2px 0; text-align: justify;">PERITOEXPERT S.A.S. se compromete a realizar el avalúo comercial del vehículo conforme a metodologías, referencias del mercado y procedimientos internos establecidos. El resultado del avalúo no compromete a la empresa con la comercialización del automotor, ni constituye una obligación de compra, venta o intermediación.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Notificaciones y reportes</p>
                    <p style="margin: 2px 0; text-align: justify;">PERITOEXPERT bajo ninguna circunstancia realizará notificaciones, reportes, alertas o registros ante autoridades, aseguradoras o terceros respecto al vehículo durante la ejecución del peritaje, salvo que exista una obligación legal expresa que así lo exija.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Derecho de suspensión o retiro del vehículo</p>
                    <p style="margin: 2px 0; text-align: justify;">La empresa se reserva el derecho de suspender la inspección o retirar el vehículo del proceso cuando este represente un riesgo para la seguridad del personal, presente fallas mecánicas graves, condiciones estructurales peligrosas o cualquier situación que pueda comprometer la integridad del vehículo o de los inspectores.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">No realización de reparaciones</p>
                    <p style="margin: 2px 0; text-align: justify;">PERITOEXPERT no realiza ningún tipo de reparación, ajuste, mantenimiento ni modificación al vehículo inspeccionado. Todas las pruebas y verificaciones realizadas son únicamente de carácter diagnóstico y observacional.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Resultados del informe</p>
                    <p style="margin: 2px 0; text-align: justify;">La empresa no emite conceptos, resultados ni conclusiones distintas a las derivadas directamente de la inspección realizada. PERITOEXPERT S.A.S. no recomienda talleres, empresas ni terceros para la reparación o intervención del vehículo.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Interpretación del informe</p>
                    <p style="margin: 2px 0; text-align: justify;">Los arreglos, reparaciones o decisiones que se deriven del informe de inspección no comprometen a PERITOEXPERT, teniendo en cuenta que el informe puede estar sujeto a diversas interpretaciones técnicas por parte de terceros.</p>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <p style="margin: 2px 0; font-weight: bold;">Exoneración por daños durante la inspección</p>
                    <p style="margin: 2px 0; text-align: justify;">PERITOEXPERT S.A.S. no se hace responsable por daños que se presenten durante la inspección cuando estos se deban a condiciones preexistentes del vehículo, desgaste natural o falta de mantenimiento, incluyendo, pero sin limitarse a: bomba de gasolina eléctrica (por bajo nivel de combustible), correa de repartición (por incumplimiento de mantenimientos recomendados por el fabricante), bobinas electrónicas, guayas de acelerador, embrague, frenos, capó, elementos eléctricos, bombillos de farolas, luces de freno, luces exploradoras, motor, caja o transmisión, así como cualquier otro componente que falle por uso previo o deterioro anterior al ingreso del vehículo al peritaje.</p>
                </div>
            </div>
            
            <!-- SISTEMAS TÉCNICOS -->
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">SUSPENSIÓN</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> PERITOEXPERT realiza una inspección visual de los componentes visibles del sistema de suspensión, tales como: tijeras, barra estabilizadora, espirales, tensores, bujes, muñecos, soportes, brazos axiales, terminales, rótulas y muelles. Adicionalmente, se efectúa una verificación básica del rebote del vehículo mediante la aplicación de fuerza manual.</p>
                <p style="margin: 2px 0;"><strong>Observaciones:</strong> La validación visual y la prueba de rebote se realizan sin desmontar ningún componente del vehículo, y se limitan únicamente a los elementos accesibles durante la inspección.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> La evaluación del estado funcional interno de espirales de suspensión, ballestas, barras de torsión, amortiguadores presurizados, sistemas hidráulicos o neumáticos de suspensión, sensores, actuadores o controladores electrónicos asociados al sistema. Tampoco se determina la vida útil restante de los elementos de suspensión, tales como tijeras, espirales, tensores, barra estabilizadora, bujes o componentes similares.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">FRENOS</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> El peritaje incluye un diagnóstico visual y una verificación física básica del funcionamiento del pedal de freno y del freno de estacionamiento. Se revisa visualmente el estado de los discos de freno, el nivel del líquido de frenos y la posible presencia de fugas en las líneas hidráulicas visibles.</p>
                <p style="margin: 2px 0;"><strong>Observaciones:</strong> La verificación del estado de los discos se limita a una inspección visual, por lo cual el resultado no garantiza el desempeño funcional del sistema de frenos en condiciones reales de uso.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> La determinación del nivel de desgaste o vida útil de pastillas, bandas, zapatas o elementos de fricción. No se evalúa el estado funcional ni la durabilidad de guayas, bomba de freno, freno de mano ni sistemas de asistencia. No se valida el funcionamiento de sensores, módulos electrónicos EBD, ABS u otros sistemas de control de frenado. No se analiza la calidad del líquido de frenos ni se realizan pruebas de ruta.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">DIRECCIÓN</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> PERITOEXPERT verifica visualmente la existencia de fugas de aceite en la caja de dirección y en el depósito del sistema hidráulico. Se inspecciona el estado visible de guardapolvos, brazos de dirección y axiales, así como la presencia de pines de seguridad en terminales y rótulas, cuando aplique.</p>
                <p style="margin: 2px 0;"><strong>Observaciones:</strong> Esta revisión es de carácter visual y no implica el uso de equipos profesionales de diagnóstico para validar el desempeño interno del sistema.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> No se realizan mediciones de alineación como camber, caster, convergencia o divergencia. No se evalúa la suavidad, precisión o confort del timón. No se valida el estado funcional interno de la caja de dirección, holguras internas, desgaste de componentes ni su vida útil.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">LLANTAS</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> Se inspecciona el estado del labrado y de la banda radial de las llantas en uso, verificando que cumplan con las profundidades mínimas exigidas por la normativa técnica vigente.</p>
                <p style="margin: 2px 0;"><strong>Observaciones:</strong> La estimación de vida útil de las llantas se realiza con base en la profundidad del labrado, la cual puede variar considerablemente dependiendo del tipo de conducción y uso posterior del vehículo.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> No se revisan componentes internos de las llantas ni se detectan deformaciones internas o externas no visibles a simple vista.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">RINES</h6>
                <p style="margin: 2px 0;">PERITOEXPERT no valida si los rines presentan procesos previos de rectificación, reconstrucción, deformación estructural, fisuras o desbalanceo.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">SISTEMA ELÉCTRICO</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> Se verifica el funcionamiento observable de los sistemas eléctricos y electrónicos del vehículo, incluyendo: techo corredizo (si aplica), retrovisores eléctricos, limpiabrisas delantero y trasero, nivel de líquido limpiaparabrisas, luces (altas, bajas, direccionales, estacionarias, freno, reversa, placa, antiniebla, luz interior y exploradoras), aire acondicionado, calefacción, desempañador, tablero de instrumentos (radio, velocímetro, tacómetro, reloj, pito y testigos) y sistema de bloqueo central.</p>
                <p style="margin: 2px 0;"><strong>Observaciones:</strong> La revisión se realiza de forma visual y funcional básica. El correcto funcionamiento depende del estado de carga de la batería al momento del peritaje.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> No se determina la vida útil de componentes eléctricos ni la potencia real de iluminación. No se inspeccionan conexiones eléctricas internas. No se valida el funcionamiento de alarmas originales o genéricas, funciones automáticas de elevalunas, retracción de espejos ni sensores o módulos electrónicos de seguridad o confort.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">TRANSMISIÓN DE POTENCIA</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> Inspección visual del estado de ejes cardánicos y crucetas, verificación de fugas de fluidos en diferencial, caja de transmisión y bomba de embrague. Se revisa el nivel del líquido de embrague cuando aplique y el estado visible de guardapolvos de semiejes.</p>
                <p style="margin: 2px 0;"><strong>Observaciones:</strong> La inspección se realiza con el vehículo en condición estacionaria, sin encendido prolongado ni uso de equipos especializados.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> No se valida el funcionamiento interno de la caja de velocidades ni del diferencial. No se evalúa desgaste interno del embrague, selectores de cambio, transmisiones automáticas, manuales, CVT o secuenciales. No se inspeccionan juntas homocinéticas, rodamientos, ruidos internos, ni sistemas de tracción integral.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">CHASIS</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> Revisión visual de puntas de chasis delanteras y traseras, piso de carrocería, baúl, panel trasero, parales, traviesas, largueros, capota, soldaduras y sellantes estructurales, así como la originalidad del sistema de identificación.</p>
                <p style="margin: 2px 0;"><strong>Observaciones:</strong> Un buen estado visual no garantiza que el vehículo conserve las medidas de alineación originales, ya que pueden existir deformaciones no perceptibles.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> No se realiza medición de cotas estructurales, distancia entre ejes ni inspección de áreas no visibles sin desmontaje.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">PINTURA</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> Validación visual del estado de la pintura y medición del espesor de micras para identificar posibles intervenciones.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> No se determina si la pintura es de fábrica ni se realizan pruebas de tono, imprimación o adherencia.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">ACCESORIOS</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> Inventario visual de accesorios adicionales al equipamiento original y estimación referencial de su valor.</p>
                <p style="margin: 2px 0;"><strong>Observaciones:</strong> Los accesorios solo se consideran como valor adicional y no garantizan funcionamiento correcto.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> No se valida el estado funcional ni comercial real de los accesorios.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">MOTOR</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> Revisión visual de fugas de fluidos, sistema de escape en baja, radiador, niveles de aceite y refrigerante, estado de correas y originalidad de identificación.</p>
                <p style="margin: 2px 0;"><strong>Observaciones:</strong> No se realiza diagnóstico con el motor en funcionamiento ni análisis interno del motor.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> No se evalúa desgaste interno, emisiones contaminantes, ruidos normales ni calidad de fluidos.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">CARROCERÍA</h6>
                <p style="margin: 2px 0;"><strong>Alcance del servicio:</strong> Inspección visual de tapicería, componentes de confort, amortiguadores de baúl y capó, lámina, pintura y ajustes de piezas externas.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> No se valida estanqueidad, ruidos, ni estructuras internas no visibles.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">VALORES COMERCIALES - PERITOEXPERT</h6>
                <p style="margin: 2px 0;">Los valores entregados son referenciales, basados en fuentes del mercado colombiano y no constituyen un valor definitivo de compra, venta o aseguramiento.</p>
            </div>
            
            <div style="margin-bottom: 8px;">
                <h6 style="font-size: 8.5px; color: #333; margin-bottom: 3px; font-weight: bold;">TESTIGOS DE ALERTA (TABLERO)</h6>
                <p style="margin: 2px 0;">Se verifica el encendido y apagado correcto de los testigos al iniciar el vehículo.</p>
                <p style="margin: 2px 0;"><strong>Este servicio NO comprende:</strong> Diagnóstico de fallas electrónicas ni lectura de códigos mediante escáner.</p>
            </div>
        </div>
        
        <div class="action-buttons" style="display: flex; justify-content: center; gap: 15px; margin: 30px 0;">
            <button onclick="backToForm()" class="btn-action btn-back">
                <i class="fas fa-arrow-left"></i> Corregir Formulario
            </button>
            <button onclick="printReport()" class="btn-action">
                <i class="fas fa-print"></i> Imprimir
            </button>
            <button onclick="saveAsPDF(event)" class="btn-action btn-pdf">
                <i class="fas fa-file-pdf"></i> Guardar como PDF
            </button>
            <button onclick="newEvaluation()" class="btn-action btn-secondary">
                <i class="fas fa-plus"></i> Nueva Evaluación
            </button>
        </div>
    `;
    
    // Insertar HTML en el contenedor del informe
    document.getElementById('finalReport').innerHTML = reportHTML;
    
    // Cargar imágenes si están disponibles
    loadReportImages();
    
    // Animar gráficas de valores comerciales
    animateCommercialValues();
    
    // Desplazar a la parte superior del informe
    window.scrollTo(0, 0);
}

// Función para generar gráficas de valores comerciales
function generateCommercialValuesHTML() {
    const marketValue = parseFloat(document.getElementById('marketValue').value.replace(/[^0-9.]/g, '')) || 0;
    const fasecoldaValue = parseFloat(document.getElementById('fasecoldaValue').value.replace(/[^0-9.]/g, '')) || 0;
    const expertValue = parseFloat(document.getElementById('expertValue').value.replace(/[^0-9.]/g, '')) || 0;
    const accessoriesValue = parseFloat(document.getElementById('accessoriesValue').value.replace(/[^0-9.]/g, '')) || 0;
    
    // Calcular valores mínimo, máximo y promedio
    const values = [marketValue, fasecoldaValue, expertValue].filter(v => v > 0);
    const minValue = values.length > 0 ? Math.min(...values) : 0;
    const maxValue = values.length > 0 ? Math.max(...values) : 0;
    const avgValue = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    
    return `
        <div class="value-chart">
            <div class="value-label">
                <span>Revista Motor</span>
                <span id="marketValueDisplay">${formatCurrency(marketValue)}</span>
            </div>
            <div class="value-bar-container">
                <div class="value-bar" id="marketBar" style="width: 0%">0%</div>
            </div>
        </div>
        <div class="value-chart">
            <div class="value-label">
                <span>Fasecolda</span>
                <span id="fasecoldaValueDisplay">${formatCurrency(fasecoldaValue)}</span>
            </div>
            <div class="value-bar-container">
                <div class="value-bar" id="fasecoldaBar" style="width: 0%">0%</div>
            </div>
        </div>
        <div class="value-chart">
            <div class="value-label">
                <span>Peritoexpert.com</span>
                <span id="expertValueDisplay">${formatCurrency(expertValue)}</span>
            </div>
            <div class="value-bar-container">
                <div class="value-bar" id="expertBar" style="width: 0%">0%</div>
            </div>
        </div>
        <div class="value-chart">
            <div class="value-label">
                <span>Accesorios</span>
                <span id="accessoriesValueDisplay">${formatCurrency(accessoriesValue)}</span>
            </div>
            <div class="value-bar-container">
                <div class="value-bar" id="accessoriesBar" style="width: 0%">0%</div>
            </div>
        </div>
        <div class="value-comparison">
            <div class="value-min">Mínimo: <span id="minValue">${formatCurrency(minValue)}</span></div>
            <div class="value-average">Promedio: <span id="avgValue">${formatCurrency(avgValue)}</span></div>
            <div class="value-max">Máximo: <span id="maxValue">${formatCurrency(maxValue)}</span></div>
        </div>
    `;
}

// Función para animar gráficas de valores comerciales
function animateCommercialValues() {
    const marketValue = parseFloat(document.getElementById('marketValue').value.replace(/[^0-9.]/g, '')) || 0;
    const fasecoldaValue = parseFloat(document.getElementById('fasecoldaValue').value.replace(/[^0-9.]/g, '')) || 0;
    const expertValue = parseFloat(document.getElementById('expertValue').value.replace(/[^0-9.]/g, '')) || 0;
    const accessoriesValue = parseFloat(document.getElementById('accessoriesValue').value.replace(/[^0-9.]/g, '')) || 0;
    
    // Calcular porcentajes para las barras
    const maxBarValue = Math.max(marketValue, fasecoldaValue, expertValue, accessoriesValue) || 1;
    
    const marketPercent = (marketValue / maxBarValue) * 100;
    const fasecoldaPercent = (fasecoldaValue / maxBarValue) * 100;
    const expertPercent = (expertValue / maxBarValue) * 100;
    const accessoriesPercent = (accessoriesValue / maxBarValue) * 100;
    
    // Animar las barras
    setTimeout(() => {
        const marketBar = document.getElementById('marketBar');
        const fasecoldaBar = document.getElementById('fasecoldaBar');
        const expertBar = document.getElementById('expertBar');
        const accessoriesBar = document.getElementById('accessoriesBar');
        
        if (marketBar) {
            marketBar.style.width = `${marketPercent}%`;
            marketBar.textContent = `${Math.round(marketPercent)}%`;
        }
        if (fasecoldaBar) {
            fasecoldaBar.style.width = `${fasecoldaPercent}%`;
            fasecoldaBar.textContent = `${Math.round(fasecoldaPercent)}%`;
        }
        if (expertBar) {
            expertBar.style.width = `${expertPercent}%`;
            expertBar.textContent = `${Math.round(expertPercent)}%`;
        }
        if (accessoriesBar) {
            accessoriesBar.style.width = `${accessoriesPercent}%`;
            accessoriesBar.textContent = `${Math.round(accessoriesPercent)}%`;
        }
    }, 500);
}

// Función para generar items de checklist
function generateChecklistItems(sectionId) {
    if (!sectionQuestions[sectionId]) return '';
    
    let html = '';
    sectionQuestions[sectionId].forEach(question => {
        const element = document.getElementById(question.id);
        if (!element) return;
        
        const value = element.value;
        let statusClass = '';
        let statusText = '';
        
        if (value === 'Bueno' || value === 'Sí') {
            statusClass = 'status-good';
            statusText = '✓';
        } else if (value === 'Regular') {
            statusClass = 'status-regular';
            statusText = '~';
        } else if (value === 'Malo' || value === 'No') {
            statusClass = 'status-bad';
            statusText = '✗';
        } else {
            statusClass = 'status-na';
            statusText = 'N/A';
        }
        
        html += `
            <div class="check-item">
                <div class="status ${statusClass}">${statusText}</div>
                <div>${question.text}</div>
            </div>
        `;
    });
    
    return html;
}

// Función para cargar imágenes en el informe
function loadReportImages() {
    const photoIds = ['Front', 'Side', 'Rear', 'Engine'];
    
    photoIds.forEach(id => {
        const input = document.getElementById(`photo${id}`);
        const reportImg = document.getElementById(`reportPhoto${id}`);
        
        if (input && input.files && input.files[0] && reportImg) {
            const reader = new FileReader();
            reader.onload = function(e) {
                reportImg.src = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        } else if (reportImg && reportImg.parentElement) {
            reportImg.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%;">Sin imagen</div>';
        }
    });
}

// Función para calcular puntajes con penalización por secciones críticas
function calculateScores() {
    const scores = {};
    
    // Calcular puntuación para cada sección
    for (const sectionId in sectionQuestions) {
        if (sectionQuestions.hasOwnProperty(sectionId)) {
            let totalScore = 0;
            let answeredQuestions = 0;
            
            sectionQuestions[sectionId].forEach(question => {
                const element = document.getElementById(question.id);
                if (!element) return;
                
                const value = element.value;
                let points = 0;
                
                if (value === 'Bueno' || value === 'Sí') {
                    points = 100;
                    answeredQuestions++;
                } else if (value === 'Regular') {
                    points = 60;
                    answeredQuestions++;
                } else if (value === 'Malo' || value === 'No') {
                    points = 0;
                    answeredQuestions++;
                } else if (value === 'N/A') {
                    points = 0;
                }
                
                totalScore += points;
            });
            
            // Calcular promedio solo con las preguntas respondidas (no N/A)
            scores[sectionId] = answeredQuestions > 0 ? Math.round(totalScore / answeredQuestions) : 0;
        }
    }
    
    return scores;
}

// Función para calcular puntuación global con penalización por secciones críticas
function calculateGlobalScore(sectionScores) {
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    // Penalización adicional si las secciones críticas están mal
    let criticalPenalty = 0;
    
    for (const section in sectionScores) {
        if (sectionWeights[section]) {
            let sectionScore = sectionScores[section];
            
            // Penalización especial para secciones críticas
            if (section == 4 || section == 7) { // Fugas y Motor
                if (sectionScore < 50) {
                    // Penalización severa: reducción del 30%
                    sectionScore = Math.max(0, sectionScore - 30);
                    criticalPenalty += 15;
                } else if (sectionScore < 70) {
                    // Penalización moderada: reducción del 15%
                    sectionScore = Math.max(0, sectionScore - 15);
                    criticalPenalty += 10;
                }
            }
            
            totalWeightedScore += sectionScore * sectionWeights[section];
            totalWeight += sectionWeights[section];
        }
    }
    
    const baseScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
    
    // Aplicar penalización adicional
    const finalScore = Math.max(0, baseScore - criticalPenalty);
    
    console.log(`Puntuación base: ${baseScore}%, Penalización crítica: ${criticalPenalty}%, Puntuación final: ${finalScore}%`);
    
    return finalScore;
}

// Configurar previsualización de imágenes
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.photo-upload').forEach(input => {
        input.addEventListener('change', function() {
            const previewId = 'preview' + this.id.replace('photo', '');
            const preview = document.getElementById(previewId);
            
            if (this.files && this.files[0] && preview) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    });
});

// Función para guardar como PDF - VERSIÓN CORREGIDA (sin hojas en blanco)
// Función para guardar como PDF - VERSIÓN CON FORMATO FIJO
async function saveAsPDF(event) {
    const element = document.getElementById('finalReport');
    const plate = document.getElementById('vehiclePlate').value || 'reporte';
    const date = new Date().toISOString().split('T')[0];
    const cleanPlate = plate.replace(/[^a-zA-Z0-9]/g, '');
    
    // Guardar referencia a los botones
    const actionButtons = element.querySelector('.action-buttons');
    let originalDisplay = '';
    if (actionButtons) {
        originalDisplay = actionButtons.style.display;
        actionButtons.style.display = 'none';
    }
    
    // Cambiar texto del botón
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    btn.disabled = true;
    
    try {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Forzar un ancho fijo para el canvas
        const originalWidth = element.style.width;
        element.style.width = '1100px';
        
        const canvas = await html2canvas(element, {
            scale: 2.5,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: 1100,
            width: 1100
        });
        
        // Restaurar el ancho original
        element.style.width = originalWidth;
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const imgWidth = 190;
        const pageHeight = 277;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        });
        
        let heightLeft = imgHeight;
        let position = 0;
        
        doc.addImage(imgData, 'JPEG', 10, position + 10, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'JPEG', 10, position + 10, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        doc.save(`Peritaje_${cleanPlate}_${date}.pdf`);
        
        if (actionButtons) {
            actionButtons.style.display = originalDisplay || 'flex';
        }
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        
    } catch (error) {
        console.error('Error:', error);
        if (actionButtons) {
            actionButtons.style.display = originalDisplay || 'flex';
        }
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        alert('Error al generar PDF: ' + error.message);
    }
}

// Función para imprimir el reporte
function printReport() {
    window.print();
}

// Función para nueva evaluación
function newEvaluation() {
    if (confirm('¿Está seguro de que desea iniciar una nueva evaluación? Se perderán los datos actuales.')) {
        // Resetear formulario
        document.getElementById('evaluationForm').reset();
        document.getElementById('evaluationForm').style.display = 'block';
        document.getElementById('finalReport').style.display = 'none';
        document.getElementById('finalReport').innerHTML = '';
        
        // Resetear sección actual
        currentSection = 1;
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById('section-1').classList.add('active');
        document.getElementById('progressBar').style.width = '7.7%';
        
        // Resetear preview de imágenes
        document.querySelectorAll('.photo-preview').forEach(preview => {
            preview.style.display = 'none';
            preview.src = '';
        });
        
        // Scroll al inicio
        window.scrollTo(0, 0);
        
        // Resetear bordes de validación
        document.querySelectorAll('select, input').forEach(element => {
            element.style.borderColor = '#ddd';
        });
        
        // Ocultar errores de validación
        document.querySelectorAll('.validation-error').forEach(error => {
            error.style.display = 'none';
        });
    }
}
