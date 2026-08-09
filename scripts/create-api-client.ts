// Vergibt einen neuen Partner-API-Key. Es gibt (bewusst) noch keine
// Admin-Oberfläche dafür - Partnerintegrationen sind ein Vertriebsprozess,
// kein Self-Service, daher genügt ein CLI-Skript für den Betreiber.
//
// Nutzung: npx tsx scripts/create-api-client.ts "Partnername GmbH"
import { PrismaClient } from "@prisma/client";
import { generateApiKey, hashApiKey, apiKeyPrefix } from "../lib/apiAuth";

const prisma = new PrismaClient();

async function main() {
  const name = process.argv[2];
  if (!name) {
    console.error('Nutzung: npx tsx scripts/create-api-client.ts "Partnername GmbH"');
    process.exit(1);
  }

  const key = generateApiKey();
  const client = await prisma.apiClient.create({
    data: {
      name,
      apiKeyHash: hashApiKey(key),
      apiKeyPrefix: apiKeyPrefix(key),
    },
  });

  console.log(`API-Client angelegt: ${client.name} (${client.id})`);
  console.log("");
  console.log("API-Key (wird nur jetzt einmal angezeigt, sicher übermitteln):");
  console.log(key);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
