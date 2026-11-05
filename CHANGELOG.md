# database-new

## 0.3.1

### Patch Changes

- Serve one sitemap at /sitemap.xml instead of a sitemap index pointing at numbered sitemap files; robots.txt now points at it.

## 0.3.0

### Minor Changes

- Storage topics rebuilt around graphics: How rows are stored now only covers storing a row, with new topics How the schema is stored and How rows are read (an indexed lookup and a full table scan), each comparing PostgreSQL, MySQL and SQLite. Disk I/O and fsync defines its two terms, How values are encoded shows two's complement as bits, and the advanced topics are ordered so each one builds on the ones before it.

## 0.2.0

### Minor Changes

- Advanced course: 29 topics that go underneath SQL, from how rows are stored on disk through indexes, query execution, transactions, MVCC, crash recovery and distributed databases, ending with a build-your-own-database capstone, plus an All queries page. How rows are stored is taught with graphics. Also since 0.1.0: the site works well on phones, long code lines scroll sideways with scrollbars shown on hover, a not found page, a back-to-top button with a scroll progress ring, softer running text, a sitemap, robots.txt, structured data and share images, and Cloudflare Web Analytics.

## 0.1.0

### Minor Changes

- Beginner course: twenty topics taught through graphics, all running in one shared SQLite database, plus a Best practices topic and an All queries page. Adds navbar links to the SQLite editor and schema designer, previous/next topic links, a scrollable topics sidebar and Hugeicons.
