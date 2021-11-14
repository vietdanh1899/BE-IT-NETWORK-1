import { credentials, Metadata } from '@grpc/grpc-js';
import { promisify } from 'util';
import { RecommendationClient } from 'models/rs_grpc_pb';
import { ItemResponse, UserRequest} from 'models/rs_pb';

class ClientService {
    private readonly client: RecommendationClient = new RecommendationClient('localhost:50051', credentials.createInsecure());
  
    public async getItemRecommended(param: UserRequest, metadata: Metadata = new Metadata()): Promise<ItemResponse> {
      return promisify<UserRequest, Metadata, ItemResponse>(this.client.getItemRecommended.bind(this.client))(param, metadata);
    }
  }
  
  export const clientService: ClientService = new ClientService();
  