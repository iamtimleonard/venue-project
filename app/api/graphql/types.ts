import { GraphQLResolveInfo } from 'graphql';
import { DataSourceContext } from './context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateVenueInput = {
  /** the general locale of the venue */
  area: Scalars['String']['input'];
  /** the capacity of the audience */
  capacity?: InputMaybe<Scalars['Int']['input']>;
  /** the ISO formatted date of the closing of the venue, as precisely as possible (YYYY-MM-DD) */
  dateClosed?: InputMaybe<Scalars['String']['input']>;
  /** the ISO formatted date of the opening of the venue, as precisely as possible (YYYY-MM-DD) */
  dateOpen: Scalars['String']['input'];
  /** the genres represented by the venue */
  genres: Array<Scalars['String']['input']>;
  /** optional id */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** the coordinates of the location of the venue */
  location?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  /** the name of the venue */
  name: Scalars['String']['input'];
  /** the type of venue */
  type?: InputMaybe<VenueType>;
};

export type CreateVenueResponse = {
  __typename?: 'CreateVenueResponse';
  /** represents status of request */
  code: Scalars['Int']['output'];
  /** Human-readable message for UI */
  message: Scalars['String']['output'];
  /** says if request was successful or not */
  success: Scalars['Boolean']['output'];
  /** the newly created listing */
  venue?: Maybe<Venue>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a new listing */
  createVenue: CreateVenueResponse;
};


export type MutationCreateVenueArgs = {
  input?: InputMaybe<CreateVenueInput>;
};

export enum PrimaryType {
  Classical = 'CLASSICAL',
  Diy = 'DIY',
  Experimental = 'EXPERIMENTAL',
  Folk = 'FOLK',
  Jazz = 'JAZZ',
  Popular = 'POPULAR',
  Rock = 'ROCK',
  Techno = 'TECHNO'
}

export type Query = {
  __typename?: 'Query';
  /** A list of venues */
  venues?: Maybe<Array<Maybe<Venue>>>;
};


export type QueryVenuesArgs = {
  area?: InputMaybe<Scalars['String']['input']>;
};

/** A location that either existed at one time or still exists */
export type Venue = {
  __typename?: 'Venue';
  /** the general locale of the venue */
  area: Scalars['String']['output'];
  /** the size of the audience */
  capacity?: Maybe<Scalars['Int']['output']>;
  /** the ISO formatted date of the closing of the venue, as precisely as possible (YYYY-MM-DD) */
  dateClosed?: Maybe<Scalars['String']['output']>;
  /** the ISO formatted date of the opening of the venue, as precisely as possible (YYYY-MM-DD) */
  dateOpen: Scalars['String']['output'];
  /** the genres represented by the venue */
  genres: Array<Scalars['String']['output']>;
  /** the ID of the venue */
  id: Scalars['Int']['output'];
  /** the coordinates of the location of the venue */
  location: Array<Scalars['Float']['output']>;
  /** the name of the venue */
  name: Scalars['String']['output'];
  /** the primary vibe of the venue */
  primary?: Maybe<PrimaryType>;
  /** the kind of space */
  type?: Maybe<VenueType>;
};

export enum VenueType {
  Bar = 'BAR',
  Club = 'CLUB',
  ConcertHall = 'CONCERT_HALL',
  Diy = 'DIY',
  Nightclub = 'NIGHTCLUB',
  OperaHouse = 'OPERA_HOUSE',
  Outdoor = 'OUTDOOR',
  Playhouse = 'PLAYHOUSE',
  Stadium = 'STADIUM'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateVenueInput: CreateVenueInput;
  CreateVenueResponse: ResolverTypeWrapper<CreateVenueResponse>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  PrimaryType: PrimaryType;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Venue: ResolverTypeWrapper<Venue>;
  VenueType: VenueType;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CreateVenueInput: CreateVenueInput;
  CreateVenueResponse: CreateVenueResponse;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  Venue: Venue;
};

export type CreateVenueResponseResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['CreateVenueResponse'] = ResolversParentTypes['CreateVenueResponse']> = {
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  venue?: Resolver<Maybe<ResolversTypes['Venue']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createVenue?: Resolver<ResolversTypes['CreateVenueResponse'], ParentType, ContextType, Partial<MutationCreateVenueArgs>>;
};

export type QueryResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  venues?: Resolver<Maybe<Array<Maybe<ResolversTypes['Venue']>>>, ParentType, ContextType, Partial<QueryVenuesArgs>>;
};

export type VenueResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['Venue'] = ResolversParentTypes['Venue']> = {
  area?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  capacity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  dateClosed?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dateOpen?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  genres?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  location?: Resolver<Array<ResolversTypes['Float']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  primary?: Resolver<Maybe<ResolversTypes['PrimaryType']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['VenueType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = DataSourceContext> = {
  CreateVenueResponse?: CreateVenueResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Venue?: VenueResolvers<ContextType>;
};

