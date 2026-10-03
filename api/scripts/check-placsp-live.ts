import { placspConnector, PLACSP_OFFICIAL_FEED_URL } from '../src/modules/procurement/connectors/placsp.connector.js';

async function main() {
  console.log('Fetching official feed from:', PLACSP_OFFICIAL_FEED_URL);
  try {
    const xml = await placspConnector.fetchFeedPage(PLACSP_OFFICIAL_FEED_URL);
    console.log('XML fetched successfully! Length:', xml.length);
    const result = placspConnector.parseFeedPage(xml, {
      maxItems: 50,
      filterTicOnly: true,
    });
    console.log('Parsed result:');
    console.log('- Raw count in feed:', result.rawCount);
    console.log('- Qualified TIC count:', result.qualifiedCount);
    console.log('- Next page URL:', result.nextUrl);
    if (result.tenders.length > 0) {
      console.log('Sample TIC tenders found:');
      for (const t of result.tenders.slice(0, 5)) {
        console.log(`  * [${t.mainCpvCode}] ${t.title} (${t.budgetAmountEur ?? 0} EUR)`);
      }
    } else {
      console.log('No TIC tenders in this page of the feed.');
    }
  } catch (err) {
    console.error('Error fetching live PLACSP:', err);
  }
}

main();
