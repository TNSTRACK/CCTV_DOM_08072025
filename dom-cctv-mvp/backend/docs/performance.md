# Performance Configuration - DOM CCTV MVP

## Database Indexes

### Events Table Indexes
```sql
-- Primary search patterns
CREATE INDEX `events_licensePlate_idx` ON `events`(`licensePlate`);
CREATE INDEX `events_eventDateTime_idx` ON `events`(`eventDateTime`);
CREATE INDEX `events_hasMetadata_idx` ON `events`(`hasMetadata`);
CREATE INDEX `events_cameraName_idx` ON `events`(`cameraName`);

-- Composite indexes for complex queries
CREATE INDEX `events_licensePlate_eventDateTime_idx` ON `events`(`licensePlate`, `eventDateTime`);
CREATE INDEX `events_hasMetadata_eventDateTime_idx` ON `events`(`hasMetadata`, `eventDateTime`);
CREATE INDEX `events_cameraName_eventDateTime_idx` ON `events`(`cameraName`, `eventDateTime`);
```

### Metadata Entries Table Indexes
```sql
-- Company-based queries
CREATE INDEX `metadata_entries_companyId_idx` ON `metadata_entries`(`companyId`);
CREATE INDEX `metadata_entries_companyId_guideDate_idx` ON `metadata_entries`(`companyId`, `guideDate`);

-- Date-based queries
CREATE INDEX `metadata_entries_guideDate_idx` ON `metadata_entries`(`guideDate`);

-- Document search
CREATE INDEX `metadata_entries_guideNumber_idx` ON `metadata_entries`(`guideNumber`);
CREATE INDEX `metadata_entries_workOrder_idx` ON `metadata_entries`(`workOrder`);
```

## Query Optimization Patterns

### 1. License Plate Search
```typescript
// Optimized for events_licensePlate_eventDateTime_idx
const searchByLicensePlate = async (plate: string) => {
  return await prisma.event.findMany({
    where: {
      licensePlate: {
        contains: plate.toUpperCase(),
      },
    },
    orderBy: {
      eventDateTime: 'desc',
    },
    take: 50,
  });
};
```

### 2. Recent Events Query
```typescript
// Optimized for events_hasMetadata_eventDateTime_idx
const getRecentEvents = async (limit: number) => {
  return await prisma.event.findMany({
    orderBy: {
      eventDateTime: 'desc',
    },
    take: limit,
    include: {
      metadata: {
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
};
```

### 3. Undocumented Events
```typescript
// Optimized for events_hasMetadata_eventDateTime_idx
const getUndocumentedEvents = async () => {
  return await prisma.event.findMany({
    where: {
      hasMetadata: false,
    },
    orderBy: {
      eventDateTime: 'desc',
    },
    take: 100,
  });
};
```

## Performance Targets

### Search Performance
- **License plate search**: < 1 second
- **Date range search**: < 2 seconds
- **Complex filters**: < 2 seconds
- **Dashboard stats**: < 1 second

### Database Configuration
```sql
-- MySQL configuration for optimal performance
SET innodb_buffer_pool_size = 1G;
SET innodb_log_file_size = 256M;
SET innodb_flush_log_at_trx_commit = 2;
SET innodb_file_per_table = 1;
```

## Monitoring Queries

### Check Index Usage
```sql
-- Check if indexes are being used
SELECT
  table_name,
  index_name,
  cardinality,
  sub_part,
  packed,
  null_field,
  index_type,
  comment
FROM information_schema.statistics
WHERE table_schema = 'dom_cctv_mvp'
AND table_name IN ('events', 'metadata_entries', 'companies', 'users');
```

### Performance Analysis
```sql
-- Check slow queries
SELECT
  query_time,
  lock_time,
  rows_sent,
  rows_examined,
  sql_text
FROM mysql.slow_log
WHERE start_time > DATE_SUB(NOW(), INTERVAL 1 HOUR)
ORDER BY query_time DESC
LIMIT 10;
```

## Optimization Strategies

### 1. Query Optimization
- Use appropriate indexes for WHERE clauses
- Avoid `SELECT *`, use specific columns
- Use `LIMIT` for pagination
- Optimize JOIN operations

### 2. Application-Level Caching
```typescript
// Example with Redis caching
const getCachedStats = async () => {
  const cached = await redis.get('dashboard:stats');
  if (cached) {
    return JSON.parse(cached);
  }
  
  const stats = await getEventStats();
  await redis.setex('dashboard:stats', 300, JSON.stringify(stats)); // 5 minutes
  return stats;
};
```

### 3. Pagination Strategy
```typescript
// Cursor-based pagination for large datasets
const getEventsPaginated = async (cursor?: string, limit: number = 25) => {
  const whereClause = cursor ? {
    eventDateTime: {
      lt: new Date(cursor),
    },
  } : {};
  
  return await prisma.event.findMany({
    where: whereClause,
    orderBy: {
      eventDateTime: 'desc',
    },
    take: limit,
  });
};
```

## Performance Testing

### Load Testing Scenarios
1. **High-frequency license plate searches**
2. **Concurrent dashboard requests**
3. **Large date range queries**
4. **Video file serving**

### Expected Performance
- **Database queries**: < 2 seconds
- **API responses**: < 3 seconds
- **Video loading**: < 5 seconds
- **Dashboard refresh**: < 1 second

## Maintenance

### Regular Tasks
1. **Analyze table statistics**: `ANALYZE TABLE events;`
2. **Optimize tables**: `OPTIMIZE TABLE events;`
3. **Monitor index usage**: Check unused indexes
4. **Review slow query log**: Weekly analysis

### Scaling Considerations
- Read replicas for heavy read workloads
- Partitioning for large tables
- Connection pooling optimization
- CDN for static assets