import { credentials, Metadata } from '@grpc/grpc-js';
import { promisify } from 'util';

import { RouteGuideClient } from 'models/route_guide_grpc_pb';
import { Feature, Point } from 'models/route_guide_pb';



class ClientService {
    private readonly client: RouteGuideClient = new RouteGuideClient('localhost:50051', credentials.createInsecure());
  
    public async sayHello(param: Point, metadata: Metadata = new Metadata()): Promise<Feature> {
      return promisify<Point, Metadata, Feature>(this.client.getFeature.bind(this.client))(param, metadata);
    }
  }
  
  export const clientService: ClientService = new ClientService();
  