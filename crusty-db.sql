--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.5 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_map_coordinates_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_map_coordinates_type AS ENUM (
    'Restaurant',
    'Delivery',
    'Both'
);


ALTER TYPE public.enum_map_coordinates_type OWNER TO postgres;

--
-- Name: enum_participates_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_participates_status AS ENUM (
    'pending',
    'completed',
    'failed'
);


ALTER TYPE public.enum_participates_status OWNER TO postgres;

--
-- Name: enum_reviews_approval_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_reviews_approval_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'Pending',
    'Approved',
    'Rejected'
);


ALTER TYPE public.enum_reviews_approval_status OWNER TO postgres;

--
-- Name: enum_toppings_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_toppings_type AS ENUM (
    'meat',
    'vegetable',
    'cheese',
    'sauce',
    'other'
);


ALTER TYPE public.enum_toppings_type OWNER TO postgres;

--
-- Name: enum_users_account_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_account_type AS ENUM (
    'user',
    'admin',
    'deactivated'
);


ALTER TYPE public.enum_users_account_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: challenges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.challenges (
    challenge_id integer NOT NULL,
    challenge_name character varying(100) NOT NULL,
    description text,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.challenges OWNER TO postgres;

--
-- Name: challenges_challenge_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.challenges_challenge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.challenges_challenge_id_seq OWNER TO postgres;

--
-- Name: challenges_challenge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.challenges_challenge_id_seq OWNED BY public.challenges.challenge_id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    comment_id integer NOT NULL,
    user_id integer NOT NULL,
    poll_id integer NOT NULL,
    comment_text text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: comments_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_comment_id_seq OWNER TO postgres;

--
-- Name: comments_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_comment_id_seq OWNED BY public.comments.comment_id;


--
-- Name: deals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.deals (
    deal_id integer NOT NULL,
    pizza_place_id integer,
    description text,
    expiration_date timestamp without time zone
);


ALTER TABLE public.deals OWNER TO postgres;

--
-- Name: deals_deal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.deals_deal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.deals_deal_id_seq OWNER TO postgres;

--
-- Name: deals_deal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.deals_deal_id_seq OWNED BY public.deals.deal_id;


--
-- Name: dietary_needs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dietary_needs (
    need_id integer NOT NULL,
    name character varying(50) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.dietary_needs OWNER TO postgres;

--
-- Name: dietary_needs_need_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dietary_needs_need_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dietary_needs_need_id_seq OWNER TO postgres;

--
-- Name: dietary_needs_need_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dietary_needs_need_id_seq OWNED BY public.dietary_needs.need_id;


--
-- Name: dietaryneeds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dietaryneeds (
    need_id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.dietaryneeds OWNER TO postgres;

--
-- Name: dietaryneeds_need_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dietaryneeds_need_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dietaryneeds_need_id_seq OWNER TO postgres;

--
-- Name: dietaryneeds_need_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dietaryneeds_need_id_seq OWNED BY public.dietaryneeds.need_id;


--
-- Name: map_coordinates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.map_coordinates (
    id integer NOT NULL,
    pizza_place_id integer NOT NULL,
    latitude numeric(10,8) NOT NULL,
    longitude numeric(11,8) NOT NULL,
    type public.enum_map_coordinates_type DEFAULT 'Restaurant'::public.enum_map_coordinates_type NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.map_coordinates OWNER TO postgres;

--
-- Name: map_coordinates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.map_coordinates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.map_coordinates_id_seq OWNER TO postgres;

--
-- Name: map_coordinates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.map_coordinates_id_seq OWNED BY public.map_coordinates.id;


--
-- Name: mapcoordinates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mapcoordinates (
    pizza_place_id integer,
    latitude numeric(9,6),
    longitude numeric(9,6)
);


ALTER TABLE public.mapcoordinates OWNER TO postgres;

--
-- Name: participate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participate (
    user_id integer NOT NULL,
    challenge_id integer NOT NULL
);


ALTER TABLE public.participate OWNER TO postgres;

--
-- Name: participates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participates (
    participate_id integer NOT NULL,
    challenge_id integer NOT NULL,
    user_id integer NOT NULL,
    status public.enum_participates_status DEFAULT 'pending'::public.enum_participates_status NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.participates OWNER TO postgres;

--
-- Name: participates_participate_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.participates_participate_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.participates_participate_id_seq OWNER TO postgres;

--
-- Name: participates_participate_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.participates_participate_id_seq OWNED BY public.participates.participate_id;


--
-- Name: pizza_place_toppings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pizza_place_toppings (
    id integer NOT NULL,
    pizza_place_id integer NOT NULL,
    topping_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.pizza_place_toppings OWNER TO postgres;

--
-- Name: pizza_place_toppings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pizza_place_toppings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pizza_place_toppings_id_seq OWNER TO postgres;

--
-- Name: pizza_place_toppings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pizza_place_toppings_id_seq OWNED BY public.pizza_place_toppings.id;


--
-- Name: pizza_place_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pizza_place_types (
    id integer NOT NULL,
    pizza_place_id integer NOT NULL,
    type_id integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.pizza_place_types OWNER TO postgres;

--
-- Name: pizza_place_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pizza_place_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pizza_place_types_id_seq OWNER TO postgres;

--
-- Name: pizza_place_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pizza_place_types_id_seq OWNED BY public.pizza_place_types.id;


--
-- Name: pizza_places; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pizza_places (
    pizza_place_id integer NOT NULL,
    name character varying(100) NOT NULL,
    address character varying(255) NOT NULL,
    phone_number character varying(20),
    description text,
    average_rating double precision DEFAULT '0'::double precision,
    website_url character varying(255),
    hours_of_operation json,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.pizza_places OWNER TO postgres;

--
-- Name: pizza_places_pizza_place_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pizza_places_pizza_place_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pizza_places_pizza_place_id_seq OWNER TO postgres;

--
-- Name: pizza_places_pizza_place_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pizza_places_pizza_place_id_seq OWNED BY public.pizza_places.pizza_place_id;


--
-- Name: pizza_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pizza_types (
    type_id integer NOT NULL,
    dough_type character varying(50) NOT NULL,
    crust_type character varying(50) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    oven_type character varying(50) DEFAULT 'Unknown'::character varying NOT NULL
);


ALTER TABLE public.pizza_types OWNER TO postgres;

--
-- Name: pizza_types_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pizza_types_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pizza_types_type_id_seq OWNER TO postgres;

--
-- Name: pizza_types_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pizza_types_type_id_seq OWNED BY public.pizza_types.type_id;


--
-- Name: pizzaplaces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pizzaplaces (
    pizza_place_id integer NOT NULL,
    name character varying(100) NOT NULL,
    address character varying(255) NOT NULL,
    phone_number character varying(15),
    website_url character varying(255),
    location_lat numeric(9,6),
    location_lng numeric(9,6),
    description text,
    average_rating numeric(3,2) DEFAULT 0
);


ALTER TABLE public.pizzaplaces OWNER TO postgres;

--
-- Name: pizzaplaces_pizza_place_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pizzaplaces_pizza_place_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pizzaplaces_pizza_place_id_seq OWNER TO postgres;

--
-- Name: pizzaplaces_pizza_place_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pizzaplaces_pizza_place_id_seq OWNED BY public.pizzaplaces.pizza_place_id;


--
-- Name: pizzaplacetoppings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pizzaplacetoppings (
    pizza_place_id integer NOT NULL,
    topping_id integer NOT NULL
);


ALTER TABLE public.pizzaplacetoppings OWNER TO postgres;

--
-- Name: pizzaplacetypes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pizzaplacetypes (
    pizza_place_id integer NOT NULL,
    type_id integer NOT NULL
);


ALTER TABLE public.pizzaplacetypes OWNER TO postgres;

--
-- Name: pizzatypes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pizzatypes (
    type_id integer NOT NULL,
    dough_type character varying(50) NOT NULL,
    oven_type character varying(50) NOT NULL
);


ALTER TABLE public.pizzatypes OWNER TO postgres;

--
-- Name: pizzatypes_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pizzatypes_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pizzatypes_type_id_seq OWNER TO postgres;

--
-- Name: pizzatypes_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pizzatypes_type_id_seq OWNED BY public.pizzatypes.type_id;


--
-- Name: poll_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.poll_options (
    id integer NOT NULL,
    text character varying(255) NOT NULL,
    poll_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.poll_options OWNER TO postgres;

--
-- Name: poll_options_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.poll_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.poll_options_id_seq OWNER TO postgres;

--
-- Name: poll_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.poll_options_id_seq OWNED BY public.poll_options.id;


--
-- Name: polls; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.polls (
    poll_id integer NOT NULL,
    question character varying(255) NOT NULL,
    options json,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    title character varying(255) NOT NULL,
    challenge_id integer,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text
);


ALTER TABLE public.polls OWNER TO postgres;

--
-- Name: polls_poll_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.polls_poll_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.polls_poll_id_seq OWNER TO postgres;

--
-- Name: polls_poll_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.polls_poll_id_seq OWNED BY public.polls.poll_id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    user_id integer NOT NULL,
    pizzeria_name character varying(255) NOT NULL,
    rating integer NOT NULL,
    review_text text NOT NULL,
    date_submitted timestamp with time zone NOT NULL,
    approval_status public.enum_reviews_approval_status DEFAULT 'Pending'::public.enum_reviews_approval_status NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_review_id_seq OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- Name: toppings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.toppings (
    topping_id integer NOT NULL,
    name character varying(50) NOT NULL,
    type character varying(20) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT toppings_type_check CHECK (((type)::text = ANY ((ARRAY['meat'::character varying, 'vegetable'::character varying, 'cheese'::character varying, 'sauce'::character varying, 'other'::character varying])::text[])))
);


ALTER TABLE public.toppings OWNER TO postgres;

--
-- Name: toppings_topping_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.toppings_topping_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.toppings_topping_id_seq OWNER TO postgres;

--
-- Name: toppings_topping_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.toppings_topping_id_seq OWNED BY public.toppings.topping_id;


--
-- Name: user_dietary_needs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_dietary_needs (
    id integer NOT NULL,
    need_id integer NOT NULL,
    user_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.user_dietary_needs OWNER TO postgres;

--
-- Name: user_dietary_needs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_dietary_needs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_dietary_needs_id_seq OWNER TO postgres;

--
-- Name: user_dietary_needs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_dietary_needs_id_seq OWNED BY public.user_dietary_needs.id;


--
-- Name: userdietaryneeds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userdietaryneeds (
    user_id integer NOT NULL,
    need_id integer NOT NULL
);


ALTER TABLE public.userdietaryneeds OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    profile_picture_url character varying(255),
    account_type character varying(10) DEFAULT 'user'::character varying,
    date_joined timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: vote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vote (
    user_id integer NOT NULL,
    poll_id integer NOT NULL
);


ALTER TABLE public.vote OWNER TO postgres;

--
-- Name: votes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.votes (
    user_id integer NOT NULL,
    poll_id integer NOT NULL,
    option_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.votes OWNER TO postgres;

--
-- Name: challenges challenge_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenges ALTER COLUMN challenge_id SET DEFAULT nextval('public.challenges_challenge_id_seq'::regclass);


--
-- Name: comments comment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN comment_id SET DEFAULT nextval('public.comments_comment_id_seq'::regclass);


--
-- Name: deals deal_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deals ALTER COLUMN deal_id SET DEFAULT nextval('public.deals_deal_id_seq'::regclass);


--
-- Name: dietary_needs need_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dietary_needs ALTER COLUMN need_id SET DEFAULT nextval('public.dietary_needs_need_id_seq'::regclass);


--
-- Name: dietaryneeds need_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dietaryneeds ALTER COLUMN need_id SET DEFAULT nextval('public.dietaryneeds_need_id_seq'::regclass);


--
-- Name: map_coordinates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_coordinates ALTER COLUMN id SET DEFAULT nextval('public.map_coordinates_id_seq'::regclass);


--
-- Name: participates participate_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participates ALTER COLUMN participate_id SET DEFAULT nextval('public.participates_participate_id_seq'::regclass);


--
-- Name: pizza_place_toppings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizza_place_toppings ALTER COLUMN id SET DEFAULT nextval('public.pizza_place_toppings_id_seq'::regclass);


--
-- Name: pizza_place_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizza_place_types ALTER COLUMN id SET DEFAULT nextval('public.pizza_place_types_id_seq'::regclass);


--
-- Name: pizza_places pizza_place_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizza_places ALTER COLUMN pizza_place_id SET DEFAULT nextval('public.pizza_places_pizza_place_id_seq'::regclass);


--
-- Name: pizza_types type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizza_types ALTER COLUMN type_id SET DEFAULT nextval('public.pizza_types_type_id_seq'::regclass);


--
-- Name: pizzaplaces pizza_place_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizzaplaces ALTER COLUMN pizza_place_id SET DEFAULT nextval('public.pizzaplaces_pizza_place_id_seq'::regclass);


--
-- Name: pizzatypes type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizzatypes ALTER COLUMN type_id SET DEFAULT nextval('public.pizzatypes_type_id_seq'::regclass);


--
-- Name: poll_options id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.poll_options ALTER COLUMN id SET DEFAULT nextval('public.poll_options_id_seq'::regclass);


--
-- Name: polls poll_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.polls ALTER COLUMN poll_id SET DEFAULT nextval('public.polls_poll_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- Name: toppings topping_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.toppings ALTER COLUMN topping_id SET DEFAULT nextval('public.toppings_topping_id_seq'::regclass);


--
-- Name: user_dietary_needs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_dietary_needs ALTER COLUMN id SET DEFAULT nextval('public.user_dietary_needs_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20240319000000-create-users.js
20240319000001-create-pizza-places.js
20240319000002-create-review.js
20240319000003-create-challenges-and-polls.js
20240319000004-create-poll-options.js
20240319000004-create-polls.js
20240319000005-create-votes.js
20240319000006-create-comments.js
20240320000002-create-deals.js
20240320000004-create-map-coordinates.js
20240320000005-create-pizza-types.js
20240320000006-create-toppings.js
20240320000007-create-reviews.js
20240321000000-add-challenge-id-to-polls.js
20240321000001-add-timestamps-to-challenges.js
20240321000002-add-options-to-polls.js
20240321000003-fix-challenge-timestamps.js
20240321000004-fix-challenge-timestamps-snake-case.js
20240321000005-add-user-id-to-polls.js
20240322000000-remove-pizza-place-id.js
20240323000000-update-review-schema.js
20240325000000-add-missing-fields-to-polls.js
20250511153329-add-missing-columns.js
20250511153404-add-missing-columns.js
20250511153838-add-title-to-polls.js
20250511160447-add-timestamps-to-polls.js
20250511170000-rename-pizza-place-types-timestamps.js
20250511180000-rename-pizza-place-types-timestamps.js
20250512-add-timestamps-to-toppings.js
\.


--
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.challenges (challenge_id, challenge_name, description, start_date, end_date, "createdAt", "updatedAt", created_at, updated_at) FROM stdin;
1	Review 5 places	Review 5 pizza places	2025-05-11 00:00:00	2025-05-31 00:00:00	2025-05-12 03:40:10.407943	2025-05-12 03:40:10.407943	2025-05-11 23:40:10.406-04	2025-05-11 23:40:10.406-04
2	Pizza Challenge	Try all pizzas in a week	2024-03-20 00:00:00	2025-06-27 00:00:00	2025-05-12 03:41:58.656445	2025-05-12 03:41:58.656445	2025-05-11 23:41:58.656-04	2025-05-11 23:41:58.656-04
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (comment_id, user_id, poll_id, comment_text, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: deals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.deals (deal_id, pizza_place_id, description, expiration_date) FROM stdin;
\.


--
-- Data for Name: dietary_needs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dietary_needs (need_id, name, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: dietaryneeds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dietaryneeds (need_id, name) FROM stdin;
\.


--
-- Data for Name: map_coordinates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.map_coordinates (id, pizza_place_id, latitude, longitude, type, "createdAt", "updatedAt") FROM stdin;
11	11	40.51870000	-74.41210000	Restaurant	2025-05-12 09:03:11.261-04	2025-05-12 09:03:11.261-04
12	12	40.73061000	-73.99541000	Restaurant	2025-05-12 09:08:16.88-04	2025-05-12 09:08:16.88-04
13	13	40.72200000	-73.99690000	Restaurant	2025-05-12 09:08:59.483-04	2025-05-12 09:08:59.483-04
\.


--
-- Data for Name: mapcoordinates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mapcoordinates (pizza_place_id, latitude, longitude) FROM stdin;
\.


--
-- Data for Name: participate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.participate (user_id, challenge_id) FROM stdin;
\.


--
-- Data for Name: participates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.participates (participate_id, challenge_id, user_id, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: pizza_place_toppings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pizza_place_toppings (id, pizza_place_id, topping_id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: pizza_place_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pizza_place_types (id, pizza_place_id, type_id, "createdAt", "updatedAt") FROM stdin;
21	11	1	2025-05-12 09:03:11.264-04	2025-05-12 09:03:11.264-04
22	11	3	2025-05-12 09:03:11.264-04	2025-05-12 09:03:11.264-04
\.


--
-- Data for Name: pizza_places; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pizza_places (pizza_place_id, name, address, phone_number, description, average_rating, website_url, hours_of_operation, created_at, updated_at) FROM stdin;
11	Francesco's Pizza & Restaurant	2595 Woodbridge Ave, Edison, NJ	555-1404	Gourmet toppings in a strip-mall setting	0	https://francescospizza.com	\N	2025-05-12 13:03:11.256	2025-05-12 13:03:11.256
12	Joe’s Pizza	7 Carmine St, New York, NY 10014	212-255-3946	Famous for classic New York-style pizza.	0	http://www.joespizza.com	\N	2025-05-12 13:08:16.87	2025-05-12 13:08:16.87
13	Lombardi’s Pizza	32 Spring St, New York, NY 10012	212-231-5737	America’s first pizzeria, known for coal-oven pizzas.	0	http://www.lombardispizza.com	\N	2025-05-12 13:08:59.477	2025-05-12 13:08:59.477
\.


--
-- Data for Name: pizza_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pizza_types (type_id, dough_type, crust_type, "createdAt", "updatedAt", oven_type) FROM stdin;
1	Neapolitan	Thin	2025-05-12 09:01:15.975519-04	2025-05-12 09:01:15.975519-04	Wood-fired
3	Sicilian	Thick	2025-05-12 09:01:15.975519-04	2025-05-12 09:01:15.975519-04	Electric
\.


--
-- Data for Name: pizzaplaces; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pizzaplaces (pizza_place_id, name, address, phone_number, website_url, location_lat, location_lng, description, average_rating) FROM stdin;
1	Joe’s Pizza	7 Carmine St, New York, NY 10014	212-255-3946	http://www.joespizza.com	40.730610	-73.995410	Famous for classic New York-style pizza.	4.80
2	Lombardi’s Pizza	32 Spring St, New York, NY 10012	212-231-5737	http://www.lombardispizza.com	40.722000	-73.996900	America’s first pizzeria, known for coal-oven pizzas.	4.70
3	Di Fara Pizza	1424 Avenue J, Brooklyn, NY 11230	718-258-1367	http://www.difarapizza.com	40.623960	-73.975420	Renowned for its handcrafted pizza.	4.90
4	Grimaldi’s Pizzeria	1 Front St, Brooklyn, NY 11201	718-858-4300	http://www.grimaldis.com	40.703300	-73.996700	Famous for its brick-oven pizza.	4.60
5	Prince Street Pizza	27 Prince St, New York, NY 10012	212-966-4100	http://www.princestreetpizza.com	40.721170	-73.995320	Known for its pepperoni slices.	4.50
6	Ribalta	48 E 12th St, New York, NY 10003	212-228-2000	http://www.ribaltapizza.com	40.731000	-73.993800	Authentic Neapolitan pizza.	4.40
7	Two Boots Pizza	2235 1st Ave, New York, NY 10029	212-996-2000	http://www.twoboots.com	40.786300	-73.937800	Unique combinations of ingredients.	4.30
8	Patsy’s Pizzeria	2287 1st Ave, New York, NY 10035	212-289-0480	http://www.patsyspizzeria.com	40.789800	-73.935600	Traditional New York pizza since 1933.	4.60
9	Sal & Carmine’s Pizza	2456 Broadway, New York, NY 10025	212-222-8833	http://www.sal-carmine.com	40.802700	-73.964400	Family-run pizza shop.	4.50
10	Nick’s Pizza	1606 3rd Ave, New York, NY 10128	212-369-0950	http://www.nickspizza.com	40.780400	-73.949000	Casual spot with a variety of toppings.	4.20
11	Sofia Pizza	112 Mineola Blvd, Mineola, NY 11501	516-747-9999	http://www.sofiapizza.com	40.740610	-73.638400	Famous for its Sicilian slices.	4.40
12	Lenny’s Pizza	2074 86th St, Brooklyn, NY 11214	718-265-7000	http://www.lennyspizza.com	40.608700	-73.996000	Iconic pizzeria known for its huge slices.	4.50
13	Pizza Time	1196 Northern Blvd, Manhasset, NY 11030	516-365-1133	http://www.pizzatime.com	40.769800	-73.703800	Local favorite with a variety of pies.	4.30
14	Toppings Pizza	240 E 86th St, New York, NY 10028	212-772-3133	http://www.toppingspizza.com	40.785000	-73.951000	Creative toppings and fresh ingredients.	4.60
15	Mamma Mia Pizza	1234 E 15th St, Brooklyn, NY 11229	718-332-2222	http://www.mammamiapizza.com	40.605600	-73.963200	Authentic Italian pizza.	4.70
16	Pizza by the Slice	400 Jericho Turnpike, Syosset, NY 11791	516-921-1111	http://www.pizzabytheslice.com	40.807500	-73.850400	Great for quick bites.	4.40
\.


--
-- Data for Name: pizzaplacetoppings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pizzaplacetoppings (pizza_place_id, topping_id) FROM stdin;
\.


--
-- Data for Name: pizzaplacetypes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pizzaplacetypes (pizza_place_id, type_id) FROM stdin;
\.


--
-- Data for Name: pizzatypes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pizzatypes (type_id, dough_type, oven_type) FROM stdin;
\.


--
-- Data for Name: poll_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.poll_options (id, text, poll_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: polls; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.polls (poll_id, question, options, date_created, title, challenge_id, user_id, created_at, updated_at, description) FROM stdin;
1	Which is your favorite?	["pepperoni","mushroom"]	2025-05-12 03:44:09.932953	Best topping?	1	2	2025-05-11 23:44:09.932-04	2025-05-11 23:44:09.932-04	favorite?
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (review_id, user_id, pizzeria_name, rating, review_text, date_submitted, approval_status, "createdAt", "updatedAt") FROM stdin;
1	2	Joe’s Pizza	5	Great pizza!	2025-05-12 09:23:36.437-04	Pending	2025-05-12 09:23:36.438-04	2025-05-12 09:23:36.438-04
\.


--
-- Data for Name: toppings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.toppings (topping_id, name, type, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: user_dietary_needs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_dietary_needs (id, need_id, user_id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: userdietaryneeds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.userdietaryneeds (user_id, need_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, email, password, profile_picture_url, account_type, date_joined) FROM stdin;
1	testuser	test@example.com	$2a$10$yAIa3rOnhyB35GZ43LPbBuDXT7RHwIH.ngr5CKhFqR44MeTcZh4wK	\N	user	2025-05-12 03:27:09.92
2	Adebayo	adebayobadeniyi@gmail.com	$2a$10$lrkqXenn75sw.6sSHRxCn.tjRttCowv6GH.GBaAUg1icH9v.cf9cS	\N	admin	2025-05-12 03:33:55.979
\.


--
-- Data for Name: vote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vote (user_id, poll_id) FROM stdin;
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.votes (user_id, poll_id, option_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: challenges_challenge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.challenges_challenge_id_seq', 2, true);


--
-- Name: comments_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_comment_id_seq', 1, false);


--
-- Name: deals_deal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.deals_deal_id_seq', 1, false);


--
-- Name: dietary_needs_need_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dietary_needs_need_id_seq', 1, false);


--
-- Name: dietaryneeds_need_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dietaryneeds_need_id_seq', 1, false);


--
-- Name: map_coordinates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.map_coordinates_id_seq', 13, true);


--
-- Name: participates_participate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.participates_participate_id_seq', 1, false);


--
-- Name: pizza_place_toppings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pizza_place_toppings_id_seq', 1, false);


--
-- Name: pizza_place_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pizza_place_types_id_seq', 22, true);


--
-- Name: pizza_places_pizza_place_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pizza_places_pizza_place_id_seq', 13, true);


--
-- Name: pizza_types_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pizza_types_type_id_seq', 2, true);


--
-- Name: pizzaplaces_pizza_place_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pizzaplaces_pizza_place_id_seq', 16, true);


--
-- Name: pizzatypes_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pizzatypes_type_id_seq', 1, false);


--
-- Name: poll_options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.poll_options_id_seq', 1, false);


--
-- Name: polls_poll_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.polls_poll_id_seq', 1, true);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 1, true);


--
-- Name: toppings_topping_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.toppings_topping_id_seq', 1, false);


--
-- Name: user_dietary_needs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_dietary_needs_id_seq', 1, false);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 2, true);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: challenges challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_pkey PRIMARY KEY (challenge_id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (comment_id);


--
-- Name: deals deals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deals
    ADD CONSTRAINT deals_pkey PRIMARY KEY (deal_id);


--
-- Name: dietary_needs dietary_needs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dietary_needs
    ADD CONSTRAINT dietary_needs_pkey PRIMARY KEY (need_id);


--
-- Name: dietaryneeds dietaryneeds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dietaryneeds
    ADD CONSTRAINT dietaryneeds_pkey PRIMARY KEY (need_id);


--
-- Name: map_coordinates map_coordinates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_coordinates
    ADD CONSTRAINT map_coordinates_pkey PRIMARY KEY (id);


--
-- Name: participate participate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participate
    ADD CONSTRAINT participate_pkey PRIMARY KEY (user_id, challenge_id);


--
-- Name: participates participates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participates
    ADD CONSTRAINT participates_pkey PRIMARY KEY (participate_id);


--
-- Name: pizza_place_toppings pizza_place_toppings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizza_place_toppings
    ADD CONSTRAINT pizza_place_toppings_pkey PRIMARY KEY (id);


--
-- Name: pizza_place_types pizza_place_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizza_place_types
    ADD CONSTRAINT pizza_place_types_pkey PRIMARY KEY (id);


--
-- Name: pizza_places pizza_places_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizza_places
    ADD CONSTRAINT pizza_places_pkey PRIMARY KEY (pizza_place_id);


--
-- Name: pizza_types pizza_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizza_types
    ADD CONSTRAINT pizza_types_pkey PRIMARY KEY (type_id);


--
-- Name: pizzaplaces pizzaplaces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizzaplaces
    ADD CONSTRAINT pizzaplaces_pkey PRIMARY KEY (pizza_place_id);


--
-- Name: pizzaplacetoppings pizzaplacetoppings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizzaplacetoppings
    ADD CONSTRAINT pizzaplacetoppings_pkey PRIMARY KEY (pizza_place_id, topping_id);


--
-- Name: pizzaplacetypes pizzaplacetypes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizzaplacetypes
    ADD CONSTRAINT pizzaplacetypes_pkey PRIMARY KEY (pizza_place_id, type_id);


--
-- Name: pizzatypes pizzatypes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizzatypes
    ADD CONSTRAINT pizzatypes_pkey PRIMARY KEY (type_id);


--
-- Name: poll_options poll_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.poll_options
    ADD CONSTRAINT poll_options_pkey PRIMARY KEY (id);


--
-- Name: polls polls_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.polls
    ADD CONSTRAINT polls_pkey PRIMARY KEY (poll_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: toppings toppings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.toppings
    ADD CONSTRAINT toppings_pkey PRIMARY KEY (topping_id);


--
-- Name: user_dietary_needs user_dietary_needs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_dietary_needs
    ADD CONSTRAINT user_dietary_needs_pkey PRIMARY KEY (id);


--
-- Name: userdietaryneeds userdietaryneeds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userdietaryneeds
    ADD CONSTRAINT userdietaryneeds_pkey PRIMARY KEY (user_id, need_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: vote vote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vote
    ADD CONSTRAINT vote_pkey PRIMARY KEY (user_id, poll_id);


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (user_id, poll_id);


--
-- Name: comments comments_poll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_poll_id_fkey FOREIGN KEY (poll_id) REFERENCES public.polls(poll_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: deals deals_pizza_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deals
    ADD CONSTRAINT deals_pizza_place_id_fkey FOREIGN KEY (pizza_place_id) REFERENCES public.pizzaplaces(pizza_place_id) ON DELETE CASCADE;


--
-- Name: map_coordinates map_coordinates_pizza_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_coordinates
    ADD CONSTRAINT map_coordinates_pizza_place_id_fkey FOREIGN KEY (pizza_place_id) REFERENCES public.pizza_places(pizza_place_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mapcoordinates mapcoordinates_pizza_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mapcoordinates
    ADD CONSTRAINT mapcoordinates_pizza_place_id_fkey FOREIGN KEY (pizza_place_id) REFERENCES public.pizzaplaces(pizza_place_id) ON DELETE CASCADE;


--
-- Name: participate participate_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participate
    ADD CONSTRAINT participate_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(challenge_id) ON DELETE CASCADE;


--
-- Name: participate participate_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participate
    ADD CONSTRAINT participate_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: participates participates_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participates
    ADD CONSTRAINT participates_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(challenge_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: participates participates_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participates
    ADD CONSTRAINT participates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pizza_place_toppings pizza_place_toppings_pizza_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizza_place_toppings
    ADD CONSTRAINT pizza_place_toppings_pizza_place_id_fkey FOREIGN KEY (pizza_place_id) REFERENCES public.pizza_places(pizza_place_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pizza_place_toppings pizza_place_toppings_topping_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizza_place_toppings
    ADD CONSTRAINT pizza_place_toppings_topping_id_fkey FOREIGN KEY (topping_id) REFERENCES public.toppings(topping_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pizza_place_types pizza_place_types_pizza_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizza_place_types
    ADD CONSTRAINT pizza_place_types_pizza_place_id_fkey FOREIGN KEY (pizza_place_id) REFERENCES public.pizza_places(pizza_place_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pizza_place_types pizza_place_types_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizza_place_types
    ADD CONSTRAINT pizza_place_types_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.pizza_types(type_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pizzaplacetoppings pizzaplacetoppings_pizza_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizzaplacetoppings
    ADD CONSTRAINT pizzaplacetoppings_pizza_place_id_fkey FOREIGN KEY (pizza_place_id) REFERENCES public.pizzaplaces(pizza_place_id) ON DELETE CASCADE;


--
-- Name: pizzaplacetoppings pizzaplacetoppings_topping_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizzaplacetoppings
    ADD CONSTRAINT pizzaplacetoppings_topping_id_fkey FOREIGN KEY (topping_id) REFERENCES public.toppings(topping_id) ON DELETE CASCADE;


--
-- Name: pizzaplacetypes pizzaplacetypes_pizza_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizzaplacetypes
    ADD CONSTRAINT pizzaplacetypes_pizza_place_id_fkey FOREIGN KEY (pizza_place_id) REFERENCES public.pizzaplaces(pizza_place_id) ON DELETE CASCADE;


--
-- Name: pizzaplacetypes pizzaplacetypes_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizzaplacetypes
    ADD CONSTRAINT pizzaplacetypes_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.pizzatypes(type_id) ON DELETE CASCADE;


--
-- Name: poll_options poll_options_poll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.poll_options
    ADD CONSTRAINT poll_options_poll_id_fkey FOREIGN KEY (poll_id) REFERENCES public.polls(poll_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: polls polls_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.polls
    ADD CONSTRAINT polls_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(challenge_id) ON DELETE CASCADE;


--
-- Name: polls polls_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.polls
    ADD CONSTRAINT polls_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: user_dietary_needs user_dietary_needs_need_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_dietary_needs
    ADD CONSTRAINT user_dietary_needs_need_id_fkey FOREIGN KEY (need_id) REFERENCES public.dietary_needs(need_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_dietary_needs user_dietary_needs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_dietary_needs
    ADD CONSTRAINT user_dietary_needs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: userdietaryneeds userdietaryneeds_need_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userdietaryneeds
    ADD CONSTRAINT userdietaryneeds_need_id_fkey FOREIGN KEY (need_id) REFERENCES public.dietaryneeds(need_id) ON DELETE CASCADE;


--
-- Name: userdietaryneeds userdietaryneeds_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userdietaryneeds
    ADD CONSTRAINT userdietaryneeds_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: vote vote_poll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vote
    ADD CONSTRAINT vote_poll_id_fkey FOREIGN KEY (poll_id) REFERENCES public.polls(poll_id) ON DELETE CASCADE;


--
-- Name: vote vote_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vote
    ADD CONSTRAINT vote_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: votes votes_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.poll_options(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: votes votes_poll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_poll_id_fkey FOREIGN KEY (poll_id) REFERENCES public.polls(poll_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: votes votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

