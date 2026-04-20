// Variables globales
let currentSection = 1;
const totalSections = 13;
let radarChart = null;

// PESOS DE SECCIONES
const sectionWeights = {
    1: 5, 2: 10, 3: 10, 4: 15, 5: 10, 6: 10, 7: 15, 8: 10, 9: 10, 10: 10, 11: 5, 12: 5
};

const sectionNames = {
    2: 'Documentación', 4: 'Fugas', 5: 'Sistema Eléctrico', 6: 'Carrocería',
    7: 'Motor', 8: 'Llantas', 9: 'Suspensión', 10: 'Interior', 11: 'Accesorios', 12: 'Prueba Ruta'
};

// ============================================================
// TEXTOS PERSONALIZABLES PARA LOS TOOLTIPS DE CADA SECCIÓN
// ============================================================

const tooltipTexts = {
    default: {
        Bueno: "✅ Perfecto estado, sin novedad. La pieza funciona correctamente.",
        Regular: "⚠️ Regular: Se observan rayones, pequeños golpes o desgaste leve. Requiere atención menor.",
        Malo: "❌ Malo: Presencia de masilla, reparaciones previas o daños estructurales. Requiere reparación.",
        "N/A": "⚪ No aplica: Esta característica no está presente en el vehículo."
    },
    
    // SECCIÓN 2: DOCUMENTACIÓN
    2: {
        Bueno: "✅ Documentación en regla y vigente. Todo en orden.",
        Regular: "⚠️ Documentación con observaciones pendientes. Revisar fechas.",
        Malo: "❌ Documentación faltante o vencida. Requiere actualización urgente.",
        "N/A": "⚪ No aplica para este vehículo."
    },
    
    // SECCIÓN 4: FUGAS DE FLUIDOS
    4: {
        Bueno: "✅ SIN FUGAS: El sistema está completamente sellado y en perfecto estado. No se detectan pérdidas de fluidos.",
        Regular: "⚠️ HUMEDAD: Se observan leves manchas de humedad o sudoración. Monitorear periódicamente. No representa fuga activa.",
        Malo: "❌ FUGA ACTIVA: Se detecta pérdida visible de fluido. Requiere reparación inmediata.",
        "N/A": "⚪ Componente no presente en el vehículo."
    },
    
    // SECCIÓN 5: SISTEMA ELÉCTRICO
    5: {
        Bueno: "✅ SISTEMA ÓPTIMO: Todos los componentes eléctricos funcionan correctamente sin novedad.",
        Regular: "⚠️ DESGASTE: Algunos componentes presentan desgaste leve o funcionan intermitentemente.",
        Malo: "❌ FALLAS: Fallas eléctricas detectadas. Requiere diagnóstico y reparación urgente.",
        "N/A": "⚪ Componente no presente en el vehículo."
    },
    
    // SECCIÓN 6: CARROCERÍA
    6: {
        Bueno: "✅ PERFECTO: Carrocería en estado impecable. Sin abolladuras, rayones, golpes ni reparaciones.",
        Regular: "⚠️ RAYONES O REPINTADO: Se observan rayones superficiales, pequeños golpes o evidencia de repintado menor. Sin daño estructural.",
        Malo: "❌ GOLPES O MASILLA: Presencia de masilla, reparaciones estructurales previas, abolladuras profundas o daños importantes.",
        "N/A": "⚪ Pieza no presente en el vehículo."
    },
    
    // SECCIÓN 7: MOTOR
    7: {
        Bueno: "✅ MOTOR ÓPTIMO: Compresión y escaneo OBD-II en parámetros normales. Funcionamiento excelente.",
        Regular: "⚠️ IRREGULARIDADES: Motor con pequeñas irregularidades. Requiere mantenimiento preventivo menor.",
        Malo: "❌ FALLAS GRAVES: Motor con fallas importantes en compresión o códigos OBD-II críticos. Requiere reparación urgente.",
        "N/A": "⚪ No aplica para este vehículo."
    },
    
    // SECCIÓN 8: LLANTAS
    8: {
        Bueno: "✅ LLANTAS ÓPTIMAS: Labrado suficiente, presión adecuada y sin daños visibles.",
        Regular: "⚠️ DESGASTE IRREGULAR: Llantas con desgaste desigual. Monitorear presión y alineación.",
        Malo: "❌ LLANTAS DAÑADAS: Llantas muy desgastadas (menos de 1.6mm), con cortes, abultamientos o daños. Requieren reemplazo inmediato.",
        "N/A": "⚪ No aplica para este vehículo."
    },
    
    // SECCIÓN 9: SUSPENSIÓN
    9: {
        Bueno: "✅ SUSPENSIÓN PERFECTA: Sin holguras, ruidos anormales ni fugas. Amortiguación correcta.",
        Regular: "⚠️ DESGASTE LEVE: Suspensión con leve desgaste. Requiere revisión periódica.",
        Malo: "❌ SUSPENSIÓN DAÑADA: Fugas de aceite en amortiguadores, componentes sueltos, holguras excesivas o ruidos fuertes.",
        "N/A": "⚪ Componente no presente en el vehículo."
    },
    
    // SECCIÓN 10: INTERIOR
    10: {
        Bueno: "✅ INTERIOR EXCELENTE: Tapicería y componentes funcionales en perfecto estado.",
        Regular: "⚠️ DESGASTE NORMAL: Interior con desgaste normal por uso. Algunos detalles estéticos menores.",
        Malo: "❌ INTERIOR DAÑADO: Tapicería rota, desgarrada o componentes no funcionales. Requiere reparación.",
        "N/A": "⚪ No aplica para este vehículo."
    },
    
    // SECCIÓN 11: ACCESORIOS
    11: {
        Bueno: "✅ ACCESORIOS OK: Accesorios instalados y funcionando correctamente.",
        Regular: "⚠️ ACCESORIOS REGULAR: Accesorios instalados pero con algún detalle estético o funcional menor.",
        Malo: "❌ ACCESORIOS DAÑADOS: Accesorios dañados o no funcionales. Requieren reparación o reemplazo.",
        "N/A": "⚪ No aplica para este vehículo."
    },
    
    // SECCIÓN 12: PRUEBA DE RUTA
    12: {
        Bueno: "✅ PRUEBA EXITOSA: Comportamiento excelente en aceleración, frenado, dirección y estabilidad.",
        Regular: "⚠️ IRREGULARIDADES: Pequeñas irregularidades en la prueba de ruta. Requiere revisión menor.",
        Malo: "❌ FALLAS EN RUTA: Prueba de ruta con fallas importantes en frenado, dirección o suspensión. Requiere revisión mecánica urgente.",
        "N/A": "⚪ No aplica para este vehículo."
    }
};

// Función para obtener el texto del tooltip
function getTooltipText(sectionId, status) {
    if (tooltipTexts[sectionId] && tooltipTexts[sectionId][status]) {
        return tooltipTexts[sectionId][status];
    }
    if (tooltipTexts.default && tooltipTexts.default[status]) {
        return tooltipTexts.default[status];
    }
    return status === 'Bueno' ? '✅ Perfecto estado' : 
           status === 'Regular' ? '⚠️ Estado regular' : 
           status === 'Malo' ? '❌ Estado malo' : '⚪ No aplica';
}

// Preguntas por sección
const sectionQuestions = {
    2: [{ id: "soat", text: "SOAT vigente" }, { id: "propertyCard", text: "Tarjeta de propiedad" }, { id: "accidentsReported", text: "Reporta siniestros" }, { id: "techReview", text: "Rev. Tecnomecánica" }, { id: "hasInsurance", text: "Aseguradora" }],
    4: [{ id: "engineOilLeak", text: "Fuga de aceite motor" }, { id: "transmissionOilLeak", text: "Fuga de aceite caja" }, { id: "coolantLeak", text: "Fuga de refrigerante" }, { id: "brakeFluidLeak", text: "Fuga de líquido de freno" }, { id: "powerSteeringLeak", text: "Fuga de dirección hidráulica" }, { id: "differentialLeak", text: "Fuga de diferencial" }],
    5: [{ id: "frontWindshield", text: "Panorámico delantero" }, { id: "rearWindshield", text: "Panorámico trasero" }, { id: "windows", text: "Vidrios" }, { id: "wipers", text: "Plumillas" }, { id: "rightHeadlight", text: "Farola derecha" }, { id: "leftHeadlight", text: "Farola izquierda" }, { id: "rightBrakeLight", text: "Stop derecho" }, { id: "leftBrakeLight", text: "Stop izquierdo" }, { id: "horn", text: "Bocina" }, { id: "battery", text: "Batería" }, { id: "fuses", text: "Fusibles" }, { id: "alternator", text: "Alternador" }],
    6: [{ id: "leftFender", text: "Guardafango izquierdo trasero" }, { id: "rightFender", text: "Guardafango derecho trasero" }, { id: "rightSide", text: "Guardafango izquierdo delantero" }, { id: "leftSide", text: "Guardafango derecho delantero" }, { id: "leftRearDoor", text: "Puerta trasera izquierda" }, { id: "rightRearDoor", text: "Puerta trasera derecha" }, { id: "rightFrontDoor", text: "Puerta delantera derecha" }, { id: "leftFrontDoor", text: "Puerta delantera izquierda" }, { id: "rightRunningBoard", text: "Estribo derecho delantero" }, { id: "hood", text: "Capo" }, { id: "leftRunningBoard", text: "Estribo izquierdo delantero" }, { id: "rightRearRunningBoard", text: "Estribo derecho trasero" }, { id: "frontBumper", text: "Defensa delantera" }, { id: "rearBumper", text: "Defensa trasera" }, { id: "roof", text: "Techo" }],
    7: [{ id: "cylinderCompression", text: "Compresión por cilindro" }, { id: "obdScan", text: "Escaneo OBD-II" }],
    8: [{ id: "frontTires", text: "Llantas delanteras" }, { id: "rearTires", text: "Llantas traseras" }, { id: "spareTire", text: "Llanta de repuesto" }, { id: "tireWear", text: "Desgaste" }, { id: "rimsCondition", text: "Estado de rines" }],
    9: [{ id: "brakePads", text: "Pastillas de freno" }, { id: "brakeDiscs", text: "Discos de freno" }, { id: "frontShocks", text: "Amortiguadores delanteros" }, { id: "rearShocks", text: "Amortiguadores traseros" }, { id: "axleTips", text: "Puntas de ejes" }, { id: "axles", text: "Axiales" }, { id: "terminals", text: "Terminales" }, { id: "ballJoints", text: "Rotulas" }, { id: "bushings", text: "Bujes" }, { id: "controlArms", text: "Tijeras" }, { id: "steeringBox", text: "Caja de dirección" }, { id: "bearings", text: "Rodamientos" }, { id: "chassis", text: "Chasís" }],
    10: [{ id: "heating", text: "Calefacción" }, { id: "ac", text: "Aire acondicionado" }, { id: "radio", text: "Radio" }, { id: "alarm", text: "Alarma" }, { id: "upholstery", text: "Tapicería" }, { id: "dashboard", text: "Tablero" }, { id: "dashboardLights", text: "Luces tablero" }, { id: "interiorLights", text: "Luces interiores" }, { id: "seatBelts", text: "Cinturones de seguridad" }, { id: "mirrors", text: "Espejos" }, { id: "powerWindows", text: "Elevavidrios" }, { id: "locks", text: "Seguros" }],
    11: [{ id: "speakers", text: "Parlantes" }, { id: "powerPlant", text: "Planta" }, { id: "steeringWheel", text: "Timón o volante" }, { id: "luxuryRims", text: "Rines de lujo" }, { id: "safetyFilm", text: "Película de seguridad" }],
    12: [{ id: "acceleration", text: "Aceleración" }, { id: "handling", text: "Maniobrabilidad" }, { id: "alignment", text: "Angulo de alineación" }, { id: "braking", text: "Condición de frenado" }, { id: "clutch", text: "Condición de embrague" }, { id: "gearboxEngine", text: "Relación caja-motor" }, { id: "vibrations", text: "Vibraciones" }]
};

function nextSection(sectionNumber) {
    document.getElementById(`section-${currentSection}`).classList.remove('active');
    document.getElementById(`section-${sectionNumber}`).classList.add('active');
    currentSection = sectionNumber;
    document.getElementById('progressBar').style.width = `${(sectionNumber / totalSections) * 100}%`;
}

function validateSection(section) {
    let isValid = true;
    document.querySelectorAll(`#section-${section} .validation-error`).forEach(e => e.style.display = 'none');
    const sectionElement = document.getElementById(`section-${section}`);
    const requiredElements = sectionElement.querySelectorAll('select[required], input[required]');
    
    requiredElements.forEach(element => {
        if (!element.value.trim()) {
            const errorElement = document.getElementById(`${element.id}Error`);
            if (errorElement) errorElement.style.display = 'block';
            isValid = false;
            element.style.borderColor = 'var(--bad)';
        } else {
            element.style.borderColor = '#ddd';
        }
    });
    
    if (section === 3) {
        const vals = ['marketValue', 'fasecoldaValue', 'expertValue'].map(id => parseFloat(document.getElementById(id).value.replace(/[^0-9.]/g, '')));
        if (vals.some(v => isNaN(v))) { alert('Los valores comerciales deben ser números válidos'); isValid = false; }
    }
    
    if (section === 13) {
        const hasPhotos = ['Front', 'Side', 'Rear', 'Engine'].some(id => document.getElementById(`photo${id}`).files.length > 0);
        if (!hasPhotos) { alert('Por favor suba al menos una foto del vehículo'); isValid = false; }
    }
    
    if (isValid) {
        if (section < totalSections) nextSection(section + 1);
        else generateReport();
    } else {
        const firstError = sectionElement.querySelector('.validation-error[style*="display: block"]');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function sanitizeText(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
function formatCurrency(value) { if (!value || isNaN(value)) return '$0'; return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value); }

function calculateScores() {
    const scores = {};
    for (const sectionId in sectionQuestions) {
        let totalScore = 0, answered = 0;
        sectionQuestions[sectionId].forEach(q => {
            const val = document.getElementById(q.id)?.value;
            if (val === 'Bueno' || val === 'Sí') { totalScore += 100; answered++; }
            else if (val === 'Regular') { totalScore += 60; answered++; }
            else if (val === 'Malo' || val === 'No') { totalScore += 0; answered++; }
        });
        scores[sectionId] = answered > 0 ? Math.round(totalScore / answered) : 0;
    }
    return scores;
}

function calculateGlobalScore(sectionScores) {
    let totalWeighted = 0, totalWeight = 0, penalty = 0;
    for (const s in sectionScores) {
        if (sectionWeights[s]) {
            let score = sectionScores[s];
            if (s == 4 || s == 7) {
                if (score < 50) { score = Math.max(0, score - 30); penalty += 15; }
                else if (score < 70) { score = Math.max(0, score - 15); penalty += 10; }
            }
            totalWeighted += score * sectionWeights[s];
            totalWeight += sectionWeights[s];
        }
    }
    return Math.max(0, Math.round(totalWeighted / totalWeight) - penalty);
}

function generateRecommendations(scores) {
    const recs = [];
    if (scores[4] < 70) recs.push("🔴 SISTEMA DE FLUIDOS: Se detectaron fugas o humedad que pueden comprometer la seguridad y el rendimiento del motor. Revisar sellos y empaques.");
    if (scores[7] < 70) recs.push("🔧 DIAGNÓSTICO DE MOTOR: Realizar un diagnóstico profundo del motor. La compresión o el escaneo OBD-II muestran anomalías.");
    if (scores[5] < 60) recs.push("💡 SISTEMA ELÉCTRICO: Inspeccionar el sistema eléctrico. Faros, luces o componentes presentan fallas.");
    if (scores[9] < 60) recs.push("🛞 TREN DELANTERO Y SUSPENSIÓN: Revisar componentes de suspensión y dirección. Se encontraron partes en estado regular o malo.");
    if (scores[6] < 70) recs.push("🚗 CARROCERÍA: Evaluar la carrocería. Se observaron rayones, abolladuras o posibles trabajos de masilla.");
    if (scores[12] < 60) recs.push("🏁 PRUEBA DE RUTA: Realizar una prueba de ruta más exhaustiva. La maniobrabilidad o el frenado presentan deficiencias.");
    if (recs.length === 0) recs.push("✅ El vehículo se encuentra en óptimas condiciones generales. Mantener el mantenimiento preventivo.");
    return recs;
}

function generateReport() {
    document.getElementById('evaluationForm').style.display = 'none';
    document.getElementById('finalReport').style.display = 'block';
    
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
    
    const sectionScores = calculateScores();
    let globalScore = calculateGlobalScore(sectionScores);
    let isApproved = globalScore >= 75;
    const recommendations = generateRecommendations(sectionScores);
    
    const reportHTML = `
        <div class="header">
            <div class="header-content">
                <div class="logo-container">
                    <div class="logo-img">
                        <img src="peritologo.png" alt="PeritoExpert">
                    </div>
                </div>
                <h1 class="report-title">Informe de Inspección Técnica</h1>
                <div class="report-number">Peritaje #${Math.floor(Math.random() * 10000)}</div>
            </div>
        </div>
        
        <div class="executive-summary">
            <div class="summary-veredict">
                <div id="veredictStamp" class="veredict-stamp ${isApproved ? 'approved' : 'rejected'}">${isApproved ? '✅ APROBADO' : '❌ NO APROBADO'}</div>
                <div style="margin-top: 8px; font-size: 11px;">Según criterios de evaluación</div>
            </div>
            <div id="trafficLight" class="traffic-light ${globalScore >= 75 ? 'green' : (globalScore >= 50 ? 'yellow' : 'red')}">${globalScore}%</div>
            <div class="summary-score">
                <div class="editable-score">
                    <input type="number" id="globalScoreInput" value="${globalScore}" min="0" max="100" step="1">
                    <span>%</span>
                </div>
                <div class="summary-label">Puntaje Global (Editable)</div>
            </div>
        </div>
        
        <div class="vehicle-display">
            <div class="vehicle-photos">
                <div class="photo-container"><div class="photo-placeholder"><img src="#" id="reportPhotoFront" style="width:100%; height:100%; object-fit:cover;"></div><div class="photo-label">Frontal</div></div>
                <div class="photo-container"><div class="photo-placeholder"><img src="#" id="reportPhotoSide" style="width:100%; height:100%; object-fit:cover;"></div><div class="photo-label">Lateral</div></div>
                <div class="photo-container"><div class="photo-placeholder"><img src="#" id="reportPhotoRear" style="width:100%; height:100%; object-fit:cover;"></div><div class="photo-label">Trasera</div></div>
                <div class="photo-container"><div class="photo-placeholder"><img src="#" id="reportPhotoEngine" style="width:100%; height:100%; object-fit:cover;"></div><div class="photo-label">Motor</div></div>
            </div>
            <div class="vehicle-info">
                <h2>Datos del Vehículo</h2>
                <div class="info-grid">
                    <div class="info-item"><div class="info-label">Clase</div><div class="info-value">${vehicleData.class}</div></div>
                    <div class="info-item"><div class="info-label">Marca</div><div class="info-value">${vehicleData.brand}</div></div>
                    <div class="info-item"><div class="info-label">Línea</div><div class="info-value">${vehicleData.line}</div></div>
                    <div class="info-item"><div class="info-label">Carrocería</div><div class="info-value">${vehicleData.body}</div></div>
                    <div class="info-item"><div class="info-label">Modelo</div><div class="info-value">${vehicleData.model}</div></div>
                    <div class="info-item"><div class="info-label">Nacionalidad</div><div class="info-value">${vehicleData.nationality}</div></div>
                    <div class="info-item"><div class="info-label">Caja</div><div class="info-value">${vehicleData.transmission}</div></div>
                    <div class="info-item"><div class="info-label">Cilindraje</div><div class="info-value">${vehicleData.engine}</div></div>
                    <div class="info-item"><div class="info-label">Combustible</div><div class="info-value">${vehicleData.fuel}</div></div>
                    <div class="info-item"><div class="info-label">Pintura</div><div class="info-value">${vehicleData.paint}</div></div>
                    <div class="info-item"><div class="info-label">Servicio</div><div class="info-value">${vehicleData.service}</div></div>
                    <div class="info-item"><div class="info-label">Kilometraje</div><div class="info-value">${vehicleData.mileage}</div></div>
                    <div class="info-item"><div class="info-label">Color</div><div class="info-value">${vehicleData.color}</div></div>
                    <div class="info-item"><div class="info-label">Chasis</div><div class="info-value">${vehicleData.chassis}</div></div>
                    <div class="info-item"><div class="info-label">Serial</div><div class="info-value">${vehicleData.serial}</div></div>
                    <div class="info-item"><div class="info-label">Motor</div><div class="info-value">${vehicleData.motor}</div></div>
                    <div class="info-item"><div class="info-label">Placa</div><div class="info-value">${vehicleData.plate}</div></div>
                </div>
            </div>
        </div>
        
        <div class="section commercial-values">
            <h2 class="section-title">Valores Comerciales</h2>
            ${generateCommercialValuesHTML()}
        </div>
        
        <div class="section">
            <h2 class="section-title">Evaluación Detallada</h2>
            ${generateDetailedSectionsHTML(sectionScores)}
        </div>
        
        <div class="recommendations">
            <h3><i class="fas fa-tools"></i> Recomendaciones</h3>
            <ul>${recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>
        
        <div class="observations">
            <h3 class="observations-title">Observaciones del Perito</h3>
            <p>${sanitizeText(document.getElementById('observations').value) || 'Sin observaciones adicionales.'}</p>
        </div>
        
        <div class="approval-criteria">
            <h3 class="criteria-title">Criterio de Aprobación</h3>
            <div class="criteria-grid">
                <div class="criteria-item approved"><div class="criteria-icon">✓</div><div class="criteria-text"><strong>Aprobado</strong><br>Puntuación ≥ 75%</div></div>
                <div class="criteria-item rejected"><div class="criteria-icon">✗</div><div class="criteria-text"><strong>No Aprobado</strong><br>Puntuación &lt; 75%</div></div>
            </div>
        </div>
        
        <div class="signature-area">
            <div class="signature-box"><div>Firma del Perito</div><div class="signature-line"></div><div>Nombre: ____________________</div><div>Registro: ___________________</div></div>
            <div id="finalStamp" class="${isApproved ? 'approved-stamp' : 'not-approved-stamp'}">${isApproved ? 'APROBADO' : 'NO APROBADO'}</div>
            <div class="signature-box"><div>Firma del Cliente</div><div class="signature-line"></div><div>Nombre: ____________________</div><div>CC/NIT: ____________________</div></div>
        </div>
        
        <div class="footer">
            <div class="footer-info">
                <div>PERITOEXPERT</div>
                <div>Teléfono: 315 715 2606</div>
                <div>Email: peritoexpert.bogota@gmail.com</div>
                <div>WEB: www.peritoexpert.com.co</div>
            </div>
            <div>Este informe es confidencial y propiedad de PERITOEXPERT. La evaluación se basa en una inspección visual y pruebas funcionales al momento de la revisión.</div>
        </div>
        
        <!-- TÉRMINOS Y CONDICIONES -->
        <div class="legal-clauses">
            <div style="margin-bottom: 8px; padding: 6px; border: 1px solid #d1ecf1; background-color: #f8f9fa;">
                <h6 style="font-size: 8px; color: #e10600; margin-bottom: 4px; font-weight: bold; text-align: center;">DECLARACIONES, AUTORIZACIONES Y CONDICIONES DEL SERVICIO</h6>
                <p style="font-size: 7px; text-align: center; font-weight: bold;">PERITOEXPERT</p>
                <div style="margin-bottom: 4px;"><p style="margin: 2px 0; font-weight: bold;">Declaración de veracidad</p><p style="margin: 2px 0; text-align: justify;">Declaro bajo gravedad de juramento que toda la información es veraz y corresponde a la realidad.</p></div>
                <div style="margin-bottom: 4px;"><p style="margin: 2px 0; font-weight: bold;">Autorización RUNT</p><p style="margin: 2px 0; text-align: justify;">Autorizo a PERITOEXPERT para consultar información en el RUNT y otras entidades.</p></div>
                <div style="margin-bottom: 4px;"><p style="margin: 2px 0; font-weight: bold;">Exoneración por daños</p><p style="margin: 2px 0; text-align: justify;">PERITOEXPERT no se hace responsable por daños preexistentes o por desgaste natural del vehículo.</p></div>
            </div>
        </div>
        
        <div class="action-buttons">
            <button onclick="printReport()" class="btn-action"><i class="fas fa-print"></i> Imprimir</button>
            <button onclick="saveAsPDF()" class="btn-action btn-pdf"><i class="fas fa-file-pdf"></i> Guardar PDF</button>
            <button onclick="saveToDevice()" class="btn-action btn-save"><i class="fas fa-download"></i> Guardar en el teléfono</button>
            <button onclick="newEvaluation()" class="btn-action btn-secondary"><i class="fas fa-plus"></i> Nueva Evaluación</button>
        </div>
    `;
    
    document.getElementById('finalReport').innerHTML = reportHTML;
    loadReportImages();
    animateCommercialValues();
    
    const scoreInput = document.getElementById('globalScoreInput');
    if (scoreInput) {
        scoreInput.addEventListener('input', function() {
            let newScore = parseInt(this.value);
            if (isNaN(newScore)) newScore = 0;
            newScore = Math.min(100, Math.max(0, newScore));
            this.value = newScore;
            const isApprovedNow = newScore >= 75;
            const veredictDiv = document.getElementById('veredictStamp');
            const trafficLight = document.getElementById('trafficLight');
            const stamp = document.getElementById('finalStamp');
            if (veredictDiv) {
                veredictDiv.textContent = isApprovedNow ? '✅ APROBADO' : '❌ NO APROBADO';
                veredictDiv.className = `veredict-stamp ${isApprovedNow ? 'approved' : 'rejected'}`;
            }
            if (trafficLight) {
                trafficLight.textContent = `${newScore}%`;
                trafficLight.className = `traffic-light ${newScore >= 75 ? 'green' : (newScore >= 50 ? 'yellow' : 'red')}`;
            }
            if (stamp) {
                stamp.textContent = isApprovedNow ? 'APROBADO' : 'NO APROBADO';
                stamp.className = isApprovedNow ? 'approved-stamp' : 'not-approved-stamp';
            }
        });
    }
    
    window.scrollTo(0, 0);
}

function generateDetailedSectionsHTML(scores) {
    let html = '';
    [2,4,5,6,7,8,9,10,11,12].forEach(sec => {
        const isCritical = sec === 4 || sec === 7;
        html += `
            <div class="subsection">
                <h3>${sectionNames[sec]} ${isCritical ? '<span style="color: var(--bad);">(Crítica)</span>' : ''}</h3>
                <div class="color-legend">
                    <div class="legend-item"><div class="legend-color green"></div><span data-tooltip="${getTooltipText(sec, 'Bueno').replace(/"/g, '&quot;')}">Bueno</span></div>
                    <div class="legend-item"><div class="legend-color yellow"></div><span data-tooltip="${getTooltipText(sec, 'Regular').replace(/"/g, '&quot;')}">Regular</span></div>
                    <div class="legend-item"><div class="legend-color red"></div><span data-tooltip="${getTooltipText(sec, 'Malo').replace(/"/g, '&quot;')}">Malo</span></div>
                    <div class="legend-item"><div class="legend-color gray"></div><span data-tooltip="${getTooltipText(sec, 'N/A').replace(/"/g, '&quot;')}">No Aplica</span></div>
                </div>
                <div class="${sec === 6 || sec === 5 || sec === 9 || sec === 10 ? 'checklist-full' : 'checklist'}">
                    ${generateChecklistItems(sec)}
                </div>
                <div class="score-card">
                    <div class="score-label">Puntuación ${sectionNames[sec]}</div>
                    <div class="score-value">${scores[sec]}%</div>
                    <div class="gauge"><div class="gauge-value" style="left: ${scores[sec]}%;" data-value="${scores[sec]}"></div></div>
                </div>
            </div>
        `;
    });
    return html;
}

function generateChecklistItems(sectionId) {
    if (!sectionQuestions[sectionId]) return '';
    let html = '';
    sectionQuestions[sectionId].forEach(q => {
        const el = document.getElementById(q.id);
        if (!el) return;
        const val = el.value;
        let statusClass = '', statusText = '', tooltip = '';
        if (val === 'Bueno' || val === 'Sí') { 
            statusClass = 'status-good'; 
            statusText = '✓'; 
            tooltip = getTooltipText(sectionId, 'Bueno');
        } else if (val === 'Regular') { 
            statusClass = 'status-regular'; 
            statusText = '~'; 
            tooltip = getTooltipText(sectionId, 'Regular');
        } else if (val === 'Malo' || val === 'No') { 
            statusClass = 'status-bad'; 
            statusText = '✗'; 
            tooltip = getTooltipText(sectionId, 'Malo');
        } else { 
            statusClass = 'status-na'; 
            statusText = 'N/A'; 
            tooltip = getTooltipText(sectionId, 'N/A');
        }
        html += `<div class="check-item"><div class="status ${statusClass}" data-tooltip="${tooltip.replace(/"/g, '&quot;')}">${statusText}</div><div>${q.text}</div></div>`;
    });
    return html;
}

function generateCommercialValuesHTML() {
    const market = parseFloat(document.getElementById('marketValue').value.replace(/[^0-9.]/g, '')) || 0;
    const fasecolda = parseFloat(document.getElementById('fasecoldaValue').value.replace(/[^0-9.]/g, '')) || 0;
    const expert = parseFloat(document.getElementById('expertValue').value.replace(/[^0-9.]/g, '')) || 0;
    const accessories = parseFloat(document.getElementById('accessoriesValue').value.replace(/[^0-9.]/g, '')) || 0;
    const maxVal = Math.max(market, fasecolda, expert, accessories) || 1;
    return `
        <div class="value-chart"><div class="value-label"><span>Revista Motor</span><span>${formatCurrency(market)}</span></div><div class="value-bar-container"><div class="value-bar" id="marketBar" style="width: 0%">0%</div></div></div>
        <div class="value-chart"><div class="value-label"><span>Fasecolda</span><span>${formatCurrency(fasecolda)}</span></div><div class="value-bar-container"><div class="value-bar" id="fasecoldaBar" style="width: 0%">0%</div></div></div>
        <div class="value-chart"><div class="value-label"><span>PeritoExpert</span><span>${formatCurrency(expert)}</span></div><div class="value-bar-container"><div class="value-bar" id="expertBar" style="width: 0%">0%</div></div></div>
        <div class="value-chart"><div class="value-label"><span>Accesorios</span><span>${formatCurrency(accessories)}</span></div><div class="value-bar-container"><div class="value-bar" id="accessoriesBar" style="width: 0%">0%</div></div></div>
    `;
}

function animateCommercialValues() {
    const market = parseFloat(document.getElementById('marketValue').value.replace(/[^0-9.]/g, '')) || 0;
    const fasecolda = parseFloat(document.getElementById('fasecoldaValue').value.replace(/[^0-9.]/g, '')) || 0;
    const expert = parseFloat(document.getElementById('expertValue').value.replace(/[^0-9.]/g, '')) || 0;
    const accessories = parseFloat(document.getElementById('accessoriesValue').value.replace(/[^0-9.]/g, '')) || 0;
    const maxVal = Math.max(market, fasecolda, expert, accessories) || 1;
    setTimeout(() => {
        const setBar = (id, val) => { const bar = document.getElementById(id); if (bar) { bar.style.width = `${(val / maxVal) * 100}%`; bar.textContent = `${Math.round((val / maxVal) * 100)}%`; } };
        setBar('marketBar', market); setBar('fasecoldaBar', fasecolda); setBar('expertBar', expert); setBar('accessoriesBar', accessories);
    }, 500);
}

function loadReportImages() {
    ['Front', 'Side', 'Rear', 'Engine'].forEach(id => {
        const input = document.getElementById(`photo${id}`);
        const img = document.getElementById(`reportPhoto${id}`);
        if (input?.files?.[0] && img) {
            const reader = new FileReader();
            reader.onload = e => img.src = e.target.result;
            reader.readAsDataURL(input.files[0]);
        } else if (img) {
            img.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%;">Sin imagen</div>';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.photo-upload').forEach(input => {
        input.addEventListener('change', function() {
            const preview = document.getElementById('preview' + this.id.replace('photo', ''));
            if (this.files?.[0] && preview) {
                const reader = new FileReader();
                reader.onload = e => { preview.src = e.target.result; preview.style.display = 'block'; };
                reader.readAsDataURL(this.files[0]);
            }
        });
    });
});

// Función para guardar PDF
async function saveAsPDF() {
    const element = document.getElementById('finalReport');
    const plate = document.getElementById('vehiclePlate').value || 'reporte';
    const date = new Date().toISOString().split('T')[0];
    
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando PDF...';
    btn.disabled = true;
    
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) actionButtons.style.display = 'none';
    
    try {
        await new Promise(r => setTimeout(r, 300));
        
        const cloneElement = element.cloneNode(true);
        cloneElement.style.position = 'absolute';
        cloneElement.style.top = '-9999px';
        cloneElement.style.left = '-9999px';
        cloneElement.style.width = '800px';
        cloneElement.style.backgroundColor = '#ffffff';
        document.body.appendChild(cloneElement);
        
        const cloneButtons = cloneElement.querySelectorAll('.action-buttons, .btn-action');
        cloneButtons.forEach(btn => btn.style.display = 'none');
        
        const canvas = await html2canvas(cloneElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: cloneElement.scrollWidth,
            windowHeight: cloneElement.scrollHeight
        });
        
        document.body.removeChild(cloneElement);
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const { jsPDF } = window.jspdf;
        
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        
        let position = 0;
        let heightLeft = imgHeight;
        
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(`Peritaje_${plate}_${date}.pdf`);
        
        if (actionButtons) actionButtons.style.display = 'flex';
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        
    } catch (error) {
        console.error('Error:', error);
        if (actionButtons) actionButtons.style.display = 'flex';
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        alert('Error al generar PDF. Por favor intente nuevamente.');
    }
}

async function saveToDevice() {
    const element = document.getElementById('finalReport');
    const plate = document.getElementById('vehiclePlate').value || 'reporte';
    const date = new Date().toISOString().split('T')[0];
    
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparando...';
    btn.disabled = true;
    
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) actionButtons.style.display = 'none';
    
    try {
        await new Promise(r => setTimeout(r, 300));
        
        const cloneElement = element.cloneNode(true);
        cloneElement.style.position = 'absolute';
        cloneElement.style.top = '-9999px';
        cloneElement.style.left = '-9999px';
        cloneElement.style.width = '800px';
        cloneElement.style.backgroundColor = '#ffffff';
        document.body.appendChild(cloneElement);
        
        const cloneButtons = cloneElement.querySelectorAll('.action-buttons, .btn-action');
        cloneButtons.forEach(btn => btn.style.display = 'none');
        
        const canvas = await html2canvas(cloneElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: cloneElement.scrollWidth,
            windowHeight: cloneElement.scrollHeight
        });
        
        document.body.removeChild(cloneElement);
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const { jsPDF } = window.jspdf;
        
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        
        let position = 0;
        let heightLeft = imgHeight;
        
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(`Peritaje_${plate}_${date}.pdf`);
        
        if (actionButtons) actionButtons.style.display = 'flex';
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        alert('✅ Informe guardado exitosamente en tu dispositivo.');
        
    } catch (error) {
        console.error('Error:', error);
        if (actionButtons) actionButtons.style.display = 'flex';
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        alert('❌ Error al guardar el informe.');
    }
}

function printReport() { 
    window.print(); 
}

function newEvaluation() {
    document.getElementById('evaluationForm').reset();
    document.getElementById('evaluationForm').style.display = 'block';
    document.getElementById('finalReport').style.display = 'none';
    document.getElementById('finalReport').innerHTML = '';
    currentSection = 1;
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    document.getElementById('section-1').classList.add('active');
    document.getElementById('progressBar').style.width = '7.7%';
    document.querySelectorAll('.photo-preview').forEach(p => { p.style.display = 'none'; p.src = ''; });
    window.scrollTo(0, 0);
    document.querySelectorAll('select, input').forEach(e => e.style.borderColor = '#ddd');
    document.querySelectorAll('.validation-error').forEach(e => e.style.display = 'none');
}
