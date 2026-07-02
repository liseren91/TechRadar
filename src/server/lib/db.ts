import {
  Client,
  TablesDB,
  ID,
  type Models,
  Permission,
  Role,
} from 'node-appwrite'
import type { AnomalyHistory } from './appwrite.types'

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!)

const tablesDB = new TablesDB(client)

export const db = {
  anomalyHistory: {
    create: (
      data: Omit<AnomalyHistory, keyof Models.Row>,
      options?: { rowId?: string; permissions?: string[] },
    ) =>
      tablesDB.createRow<AnomalyHistory>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'anomaly-history',
        rowId: options?.rowId ?? ID.unique(),
        data,
        permissions: [
          Permission.write(Role.user(data.createdBy)),
          Permission.read(Role.user(data.createdBy)),
          Permission.update(Role.user(data.createdBy)),
          Permission.delete(Role.user(data.createdBy)),
        ],
      }),
    get: (id: string) =>
      tablesDB.getRow<AnomalyHistory>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'anomaly-history',
        rowId: id,
      }),
    update: (
      id: string,
      data: Partial<Omit<AnomalyHistory, keyof Models.Row>>,
      options?: { permissions?: string[] },
    ) =>
      tablesDB.updateRow<AnomalyHistory>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'anomaly-history',
        rowId: id,
        data,
        ...(options?.permissions ? { permissions: options.permissions } : {}),
      }),
    delete: (id: string) =>
      tablesDB.deleteRow({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'anomaly-history',
        rowId: id,
      }),
    list: (queries?: string[]) =>
      tablesDB.listRows<AnomalyHistory>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'anomaly-history',
        queries,
      }),
  },
}
