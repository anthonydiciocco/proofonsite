#!/usr/bin/env bun

/**
 * Script pour vérifier la cohérence des fichiers de traduction i18n
 *
 * Vérifie que :
 * - Toutes les langues ont les mêmes clés
 * - Aucune clé n'est manquante
 * - Aucune valeur n'est vide
 *
 * Usage: bun run scripts/validate-i18n.ts
 */

import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const LOCALES_DIR = join(process.cwd(), 'i18n', 'locales')

interface TranslationObject {
  [key: string]: string | TranslationObject
}

function getAllKeys(obj: TranslationObject, prefix = ''): string[] {
  const keys: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'object' && value !== null) {
      keys.push(...getAllKeys(value, fullKey))
    } else {
      keys.push(fullKey)
    }
  }

  return keys.sort()
}

function checkMissingValues(obj: TranslationObject, prefix = ''): string[] {
  const missing: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'object' && value !== null) {
      missing.push(...checkMissingValues(value, fullKey))
    } else if (typeof value === 'string' && value.trim() === '') {
      missing.push(fullKey)
    }
  }

  return missing
}

async function validateI18n() {
  console.log('🌍 Validation des fichiers de traduction i18n...\n')

  try {
    // Lire tous les fichiers JSON dans le dossier locales
    const files = await readdir(LOCALES_DIR)
    const jsonFiles = files.filter(f => f.endsWith('.json'))

    if (jsonFiles.length === 0) {
      console.error('❌ Aucun fichier de traduction trouvé dans locales/')
      process.exit(1)
    }

    console.log(`📁 Fichiers trouvés: ${jsonFiles.join(', ')}\n`)

    // Charger toutes les traductions
    const translations: Record<string, TranslationObject> = {}
    const allKeys: Record<string, string[]> = {}

    for (const file of jsonFiles) {
      const locale = file.replace('.json', '')
      const content = await readFile(join(LOCALES_DIR, file), 'utf-8')
      translations[locale] = JSON.parse(content)
      allKeys[locale] = getAllKeys(translations[locale])
    }

    // Vérifier la cohérence des clés
    const baseLocale = 'en'
    const baseKeys = allKeys[baseLocale]

    if (!baseKeys) {
      console.error(`❌ Le fichier de base ${baseLocale}.json n'existe pas`)
      process.exit(1)
    }

    let hasErrors = false

    for (const [locale, keys] of Object.entries(allKeys)) {
      if (locale === baseLocale) continue

      // Clés manquantes
      const missingKeys = baseKeys.filter(k => !keys.includes(k))
      if (missingKeys.length > 0) {
        console.error(`❌ ${locale}.json: ${missingKeys.length} clé(s) manquante(s):`)
        missingKeys.forEach(k => console.error(`   - ${k}`))
        console.log()
        hasErrors = true
      }

      // Clés en trop
      const extraKeys = keys.filter(k => !baseKeys.includes(k))
      if (extraKeys.length > 0) {
        console.warn(`⚠️  ${locale}.json: ${extraKeys.length} clé(s) en trop:`)
        extraKeys.forEach(k => console.warn(`   - ${k}`))
        console.log()
      }
    }

    // Vérifier les valeurs vides
    for (const [locale, translation] of Object.entries(translations)) {
      const emptyValues = checkMissingValues(translation)
      if (emptyValues.length > 0) {
        console.warn(`⚠️  ${locale}.json: ${emptyValues.length} valeur(s) vide(s):`)
        emptyValues.forEach(k => console.warn(`   - ${k}`))
        console.log()
      }
    }

    // Statistiques
    console.log('\n📊 Statistiques:')
    console.log(`   Langues: ${jsonFiles.length}`)
    console.log(`   Clés (${baseLocale}): ${baseKeys.length}`)

    for (const [locale, keys] of Object.entries(allKeys)) {
      if (locale !== baseLocale) {
        const coverage = ((keys.length / baseKeys.length) * 100).toFixed(1)
        const icon = coverage === '100.0' ? '✅' : '⚠️'
        console.log(`   ${icon} ${locale}: ${keys.length} clés (${coverage}% de couverture)`)
      }
    }

    if (hasErrors) {
      console.error('\n❌ Validation échouée. Veuillez corriger les erreurs ci-dessus.')
      process.exit(1)
    } else {
      console.log('\n✅ Toutes les traductions sont cohérentes!')
      process.exit(0)
    }

  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error)
    process.exit(1)
  }
}

validateI18n()
