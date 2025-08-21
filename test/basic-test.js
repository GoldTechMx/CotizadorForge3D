/**
 * Tests básicos para Cotizador Forge3D
 */

// Test de funciones básicas
function runBasicTests() {
  console.log('🧪 Ejecutando tests básicos...');
  
  // Test 1: Validar configuración
  testConfig();
  
  // Test 2: Cálculos matemáticos
  testCalculations();
  
  // Test 3: Gestión de materiales
  testMaterialManager();
  
  // Test 4: Validaciones de entrada
  testValidations();
  
  console.log('✅ Tests básicos completados');
}

function testConfig() {
  console.log('Testing configuración...');
  
  const config = CONFIG_DEFAULT;
  assert(config.tarifaLuz > 0, 'Tarifa de luz debe ser positiva');
  assert(config.tarifaHora > 0, 'Tarifa por hora debe ser positiva');
  assert(config.porcentajeUtilidad >= 0, 'Porcentaje de utilidad válido');
  
  console.log('✓ Configuración OK');
}

function testCalculations() {
  console.log('Testing cálculos...');
  
  // Mock data para test
  const testData = {
    nombre: 'Test Piece',
    cantidad: 1,
    tiempoHoras: 2,
    watts: 120,
    costoCarrete: 500,
    metrosUsados: 10,
    extra: 0,
    comision: 0,
    porcentajeDesperdicio: 10
  };
  
  const result = PriceCalculator.calculatePiece(testData);
  
  assert(result.precioFinal > 0, 'Precio final debe ser positivo');
  assert(result.costoBase > 0, 'Costo base debe ser positivo');
  assert(result.gramosUsados > 0, 'Gramos usados debe ser positivo');
  
  console.log('✓ Cálculos OK');
}

function testMaterialManager() {
  console.log('Testing Material Manager...');
  
  // Test conversión metros a gramos
  const metros = 10;
  const gramos = MaterialManager.convertMetersToGrams(metros);
  assert(gramos > 0, 'Conversión metros a gramos');
  
  // Test conversión gramos a metros
  const gramosTest = 50;
  const metrosResult = MaterialManager.convertGramsToMeters(gramosTest);
  assert(metrosResult > 0, 'Conversión gramos a metros');
  
  console.log('✓ Material Manager OK');
}

function testValidations() {
  console.log('Testing validaciones...');
  
  // Test validación de nombre
  const emptyName = '';
  const validName = 'Pieza de prueba';
  
  assert(Utils.sanitizeText(emptyName) === '', 'Nombre vacío sanitizado');
  assert(Utils.sanitizeText(validName).length > 0, 'Nombre válido sanitizado');
  
  // Test validación de rango
  assert(Utils.validateRange(5, 1, 10) === true, 'Valor en rango válido');
  assert(Utils.validateRange(15, 1, 10) === false, 'Valor fuera de rango');
  
  console.log('✓ Validaciones OK');
}

// Función assert simple
function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ Test failed: ${message}`);
  }
}

// Ejecutar tests si estamos en modo desarrollo
if (ENV_CONFIG && ENV_CONFIG.debugMode) {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(runBasicTests, 1000);
  });
}
