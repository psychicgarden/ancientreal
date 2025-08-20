import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔍 HARDHAT DIAGNOSTIC ANALYSIS');
console.log('================================\n');

// 1. Check Node.js and npm versions
console.log('📋 Environment Check:');
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js: ${nodeVersion}`);
  console.log(`✅ npm: ${npmVersion}`);
} catch (error) {
  console.log('❌ Error checking versions:', error.message);
}

// 2. Check package.json configuration
console.log('\n📦 Package.json Analysis:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`✅ Type: ${packageJson.type || 'commonjs'}`);
  console.log(`✅ Hardhat version: ${packageJson.dependencies?.hardhat || 'Not found'}`);
  console.log(`✅ Hardhat toolbox: ${packageJson.dependencies?.['@nomicfoundation/hardhat-toolbox'] || 'Not found'}`);
  
  // Check for version conflicts
  const hardhatVersion = packageJson.dependencies?.hardhat;
  const toolboxVersion = packageJson.dependencies?.['@nomicfoundation/hardhat-toolbox'];
  
  if (hardhatVersion && toolboxVersion) {
    console.log('⚠️  Version compatibility check:');
    console.log(`   Hardhat: ${hardhatVersion}`);
    console.log(`   Toolbox: ${toolboxVersion}`);
    
    if (hardhatVersion.includes('3.0.0') && toolboxVersion.includes('6.1.0')) {
      console.log('❌ CONFLICT: Hardhat 3.0.0 + Toolbox 6.1.0 = Incompatible');
    } else {
      console.log('✅ Versions appear compatible');
    }
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// 3. Check Hardhat configuration
console.log('\n⚙️  Hardhat Config Analysis:');
try {
  const configPath = 'hardhat.config.js';
  if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, 'utf8');
    console.log('✅ hardhat.config.js exists');
    
    // Check for ES module syntax
    if (configContent.includes('import ') && configContent.includes('export default')) {
      console.log('✅ Using ES module syntax');
    } else if (configContent.includes('require(') && configContent.includes('module.exports')) {
      console.log('✅ Using CommonJS syntax');
    } else {
      console.log('⚠️  Mixed or unclear syntax');
    }
    
    // Check for toolbox import
    if (configContent.includes('@nomicfoundation/hardhat-toolbox')) {
      console.log('✅ Hardhat toolbox imported');
    } else {
      console.log('⚠️  Hardhat toolbox not imported');
    }
  } else {
    console.log('❌ hardhat.config.js not found');
  }
} catch (error) {
  console.log('❌ Error reading hardhat config:', error.message);
}

// 4. Check node_modules for conflicts
console.log('\n📁 Node Modules Analysis:');
try {
  const nodeModulesPath = 'node_modules';
  if (fs.existsSync(nodeModulesPath)) {
    console.log('✅ node_modules exists');
    
    // Check for multiple hardhat versions
    const hardhatPath = path.join(nodeModulesPath, 'hardhat');
    if (fs.existsSync(hardhatPath)) {
      const packageJsonPath = path.join(hardhatPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const hardhatPackage = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        console.log(`✅ Hardhat version in node_modules: ${hardhatPackage.version}`);
      }
    }
    
    // Check for toolbox
    const toolboxPath = path.join(nodeModulesPath, '@nomicfoundation', 'hardhat-toolbox');
    if (fs.existsSync(toolboxPath)) {
      console.log('✅ Hardhat toolbox found in node_modules');
    } else {
      console.log('❌ Hardhat toolbox not found in node_modules');
    }
  } else {
    console.log('❌ node_modules not found');
  }
} catch (error) {
  console.log('❌ Error checking node_modules:', error.message);
}

// 5. Check for Zod version conflicts
console.log('\n🔧 Zod Version Analysis:');
try {
  const zodPath = path.join('node_modules', 'zod');
  if (fs.existsSync(zodPath)) {
    const zodPackagePath = path.join(zodPath, 'package.json');
    if (fs.existsSync(zodPackagePath)) {
      const zodPackage = JSON.parse(fs.readFileSync(zodPackagePath, 'utf8'));
      console.log(`✅ Zod version: ${zodPackage.version}`);
      
      if (zodPackage.version.startsWith('3.')) {
        console.log('⚠️  Zod v3 detected - may cause compatibility issues');
      }
    }
  }
  
  // Check for multiple zod versions
  const hardhatZodPath = path.join('node_modules', 'hardhat', 'node_modules', 'zod');
  if (fs.existsSync(hardhatZodPath)) {
    const hardhatZodPackagePath = path.join(hardhatZodPath, 'package.json');
    if (fs.existsSync(hardhatZodPackagePath)) {
      const hardhatZodPackage = JSON.parse(fs.readFileSync(hardhatZodPackagePath, 'utf8'));
      console.log(`⚠️  Hardhat's Zod version: ${hardhatZodPackage.version}`);
      console.log('⚠️  Multiple Zod versions detected - potential conflict');
    }
  }
} catch (error) {
  console.log('❌ Error checking Zod versions:', error.message);
}

// 6. Generate solutions
console.log('\n🛠️  RECOMMENDED SOLUTIONS:');
console.log('==========================');

console.log('\n1. FIX VERSION CONFLICTS:');
console.log('   npm uninstall @nomicfoundation/hardhat-toolbox');
console.log('   npm install @nomicfoundation/hardhat-toolbox@^5.0.0');

console.log('\n2. FIX ZOD CONFLICTS:');
console.log('   npm install zod@^3.22.4 --save-exact');
console.log('   npm dedupe');

console.log('\n3. ALTERNATIVE: USE SIMPLE CONFIG:');
console.log('   Remove hardhat-toolbox and use basic hardhat config');

console.log('\n4. CLEAN INSTALL:');
console.log('   rm -rf node_modules package-lock.json');
console.log('   npm install');

console.log('\n5. USE ALTERNATIVE DEPLOYMENT:');
console.log('   Create simple deployment script without hardhat');

console.log('\n🔍 DIAGNOSTIC COMPLETE');
