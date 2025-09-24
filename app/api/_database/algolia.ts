type SearchResults<T> = {
  hits: T[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
};

export class AlgoliaAPI<T> {
  private client: any;
  private indexName: string;

  constructor(client: any, indexName: string) {
    this.client = client;
    this.indexName = indexName;
  }

  // Buscar registros (todos o que coinciden con query)
  async search(
    query: string = "",
    limit: number = 20,
    offset: number = 0
  ): Promise<SearchResults<T>> {
    const { results } = await this.client.search({
      requests: [
        {
          indexName: this.indexName,
          query,
          hitsPerPage: limit,
          page: offset,
        },
      ],
    });
    return results[0];
  }

  // Agregar un nuevo registro (crear o actualizar)
  async saveObject(id: string, body: Partial<T>): Promise<{ taskID: string }> {
    const record = {
      objectID: id,
      ...body,
    };
    const { taskID } = await this.client.saveObject({
      indexName: this.indexName,
      body: record,
    });
    return { taskID };
  }

  // Obtener un registro por ID
  async getObject(id: string): Promise<T> {
    return await this.client.getObject({
      indexName: this.indexName,
      objectID: id,
    });
  }

  // Actualizar parcialmente un registro por ID
  async partialUpdateObject(
    id: string,
    attributesToUpdate: Partial<T>
  ): Promise<any> {
    return await this.client.partialUpdateObject({
      indexName: this.indexName,
      objectID: id,
      attributesToUpdate,
    });
  }
}
