import { DataSource, EntityTarget } from "typeorm";

export function getSafeSelectFields<T>(
  dataSource: DataSource,
  entity: EntityTarget<T>,
  fields?: string[],
): (keyof T)[] | undefined {
  if (!fields || fields.length === 0) return undefined;

  const metadata = dataSource.getMetadata(entity);
  const validColumns = metadata.columns.map((col) => col.propertyName);
  const safeFields = fields.filter((field) => validColumns.includes(field));
  return safeFields as (keyof T)[];
}
