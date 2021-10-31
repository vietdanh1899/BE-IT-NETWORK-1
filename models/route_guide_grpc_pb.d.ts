// package: routeguide
// file: route_guide.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as route_guide_pb from "./route_guide_pb";

interface IRouteGuideService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getFeature: IRouteGuideService_IGetFeature;
    listFeatures: IRouteGuideService_IListFeatures;
    recordRoute: IRouteGuideService_IRecordRoute;
    routeChat: IRouteGuideService_IRouteChat;
}

interface IRouteGuideService_IGetFeature extends grpc.MethodDefinition<route_guide_pb.Point, route_guide_pb.Feature> {
    path: "/routeguide.RouteGuide/GetFeature";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<route_guide_pb.Point>;
    requestDeserialize: grpc.deserialize<route_guide_pb.Point>;
    responseSerialize: grpc.serialize<route_guide_pb.Feature>;
    responseDeserialize: grpc.deserialize<route_guide_pb.Feature>;
}
interface IRouteGuideService_IListFeatures extends grpc.MethodDefinition<route_guide_pb.Rectangle, route_guide_pb.Feature> {
    path: "/routeguide.RouteGuide/ListFeatures";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<route_guide_pb.Rectangle>;
    requestDeserialize: grpc.deserialize<route_guide_pb.Rectangle>;
    responseSerialize: grpc.serialize<route_guide_pb.Feature>;
    responseDeserialize: grpc.deserialize<route_guide_pb.Feature>;
}
interface IRouteGuideService_IRecordRoute extends grpc.MethodDefinition<route_guide_pb.Point, route_guide_pb.RouteSummary> {
    path: "/routeguide.RouteGuide/RecordRoute";
    requestStream: true;
    responseStream: false;
    requestSerialize: grpc.serialize<route_guide_pb.Point>;
    requestDeserialize: grpc.deserialize<route_guide_pb.Point>;
    responseSerialize: grpc.serialize<route_guide_pb.RouteSummary>;
    responseDeserialize: grpc.deserialize<route_guide_pb.RouteSummary>;
}
interface IRouteGuideService_IRouteChat extends grpc.MethodDefinition<route_guide_pb.RouteNote, route_guide_pb.RouteNote> {
    path: "/routeguide.RouteGuide/RouteChat";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<route_guide_pb.RouteNote>;
    requestDeserialize: grpc.deserialize<route_guide_pb.RouteNote>;
    responseSerialize: grpc.serialize<route_guide_pb.RouteNote>;
    responseDeserialize: grpc.deserialize<route_guide_pb.RouteNote>;
}

export const RouteGuideService: IRouteGuideService;

export interface IRouteGuideServer extends grpc.UntypedServiceImplementation {
    getFeature: grpc.handleUnaryCall<route_guide_pb.Point, route_guide_pb.Feature>;
    listFeatures: grpc.handleServerStreamingCall<route_guide_pb.Rectangle, route_guide_pb.Feature>;
    recordRoute: grpc.handleClientStreamingCall<route_guide_pb.Point, route_guide_pb.RouteSummary>;
    routeChat: grpc.handleBidiStreamingCall<route_guide_pb.RouteNote, route_guide_pb.RouteNote>;
}

export interface IRouteGuideClient {
    getFeature(request: route_guide_pb.Point, callback: (error: grpc.ServiceError | null, response: route_guide_pb.Feature) => void): grpc.ClientUnaryCall;
    getFeature(request: route_guide_pb.Point, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: route_guide_pb.Feature) => void): grpc.ClientUnaryCall;
    getFeature(request: route_guide_pb.Point, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: route_guide_pb.Feature) => void): grpc.ClientUnaryCall;
    listFeatures(request: route_guide_pb.Rectangle, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<route_guide_pb.Feature>;
    listFeatures(request: route_guide_pb.Rectangle, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<route_guide_pb.Feature>;
    recordRoute(callback: (error: grpc.ServiceError | null, response: route_guide_pb.RouteSummary) => void): grpc.ClientWritableStream<route_guide_pb.Point>;
    recordRoute(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: route_guide_pb.RouteSummary) => void): grpc.ClientWritableStream<route_guide_pb.Point>;
    recordRoute(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: route_guide_pb.RouteSummary) => void): grpc.ClientWritableStream<route_guide_pb.Point>;
    recordRoute(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: route_guide_pb.RouteSummary) => void): grpc.ClientWritableStream<route_guide_pb.Point>;
    routeChat(): grpc.ClientDuplexStream<route_guide_pb.RouteNote, route_guide_pb.RouteNote>;
    routeChat(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<route_guide_pb.RouteNote, route_guide_pb.RouteNote>;
    routeChat(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<route_guide_pb.RouteNote, route_guide_pb.RouteNote>;
}

export class RouteGuideClient extends grpc.Client implements IRouteGuideClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public getFeature(request: route_guide_pb.Point, callback: (error: grpc.ServiceError | null, response: route_guide_pb.Feature) => void): grpc.ClientUnaryCall;
    public getFeature(request: route_guide_pb.Point, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: route_guide_pb.Feature) => void): grpc.ClientUnaryCall;
    public getFeature(request: route_guide_pb.Point, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: route_guide_pb.Feature) => void): grpc.ClientUnaryCall;
    public listFeatures(request: route_guide_pb.Rectangle, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<route_guide_pb.Feature>;
    public listFeatures(request: route_guide_pb.Rectangle, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<route_guide_pb.Feature>;
    public recordRoute(callback: (error: grpc.ServiceError | null, response: route_guide_pb.RouteSummary) => void): grpc.ClientWritableStream<route_guide_pb.Point>;
    public recordRoute(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: route_guide_pb.RouteSummary) => void): grpc.ClientWritableStream<route_guide_pb.Point>;
    public recordRoute(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: route_guide_pb.RouteSummary) => void): grpc.ClientWritableStream<route_guide_pb.Point>;
    public recordRoute(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: route_guide_pb.RouteSummary) => void): grpc.ClientWritableStream<route_guide_pb.Point>;
    public routeChat(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<route_guide_pb.RouteNote, route_guide_pb.RouteNote>;
    public routeChat(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<route_guide_pb.RouteNote, route_guide_pb.RouteNote>;
}
