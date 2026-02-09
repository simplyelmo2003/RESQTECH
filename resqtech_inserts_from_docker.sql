--
-- PostgreSQL database dump
--

\restrict E55r7G9e0rdNm5aX3jIT5VjAeI17F8dDx7m8NhyvDh8mSzOrGky3h1qOroi7DAh

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public._prisma_migrations VALUES ('6bdee424-e10c-45b6-a2b8-68ed34218b28', '30def5cbbf29e38fe6bab026e6509b34780091a173e6bbbb9c6be4f45be3e01d', '2025-12-01 04:29:56.888385+00', '20251201042956_init', NULL, NULL, '2025-12-01 04:29:56.804961+00', 1);
INSERT INTO public._prisma_migrations VALUES ('d6ad5232-463e-44ea-bccd-47241b8d9480', 'c8f13ff3ac463bd2dc958451d8c98c0b352f5518fd78a37f310ebacc9b6ef853', '2025-12-01 13:21:04.607004+00', '20251201132104_add_email_to_user', NULL, NULL, '2025-12-01 13:21:04.576881+00', 1);
INSERT INTO public._prisma_migrations VALUES ('f94cb8c8-3d8d-4d20-a711-2f561f171698', 'fcfe338f9e11db04d6a59ec31600681e8bbff5f6fcbed70451262792d81a933b', '2025-12-02 01:51:45.564773+00', '20251202015145_add_imageurls_to_incidentreport', NULL, NULL, '2025-12-02 01:51:45.554624+00', 1);
INSERT INTO public._prisma_migrations VALUES ('b1c277ae-47da-44db-ba8c-e411ccd51e80', 'c25450b83b5066be16ca831c5d245a93aebe0a51b185508892f1768ef8c2162e', '2025-12-04 14:08:57.924777+00', '20251204140857_add_message_fields', NULL, NULL, '2025-12-04 14:08:57.800488+00', 1);
INSERT INTO public._prisma_migrations VALUES ('d57efefc-9139-4665-835c-759d0f02a0fc', '05c99d647896dda77b95a308ad1bd99aa69ba998ed7cde184333d4721ba03fde', '2025-12-17 11:57:09.717157+00', '20251217115709_add_households_to_incident_reports', NULL, NULL, '2025-12-17 11:57:09.691056+00', 1);
INSERT INTO public._prisma_migrations VALUES ('7c308b7b-75bb-4cdf-91c1-6422abd6c62e', 'c374ba5104129c2f13cc2f2923cb26a97f40fa5f8235ce7bc0e47b7be0d2179b', '2025-12-18 02:01:54.196538+00', '20251218020154_create_affected_person_table', NULL, NULL, '2025-12-18 02:01:54.116471+00', 1);
INSERT INTO public._prisma_migrations VALUES ('cf760461-433a-41b3-bc24-dd9b2c6d41d6', 'a9faf1a0d747e69a5ed9692aa561dc32e9c827a29ca7db91300cdbcddc84f9cb', '2025-12-18 02:18:16.132443+00', '20251218021816_add_barangay_to_affected_person', NULL, NULL, '2025-12-18 02:18:16.072231+00', 1);


--
-- Data for Name: barangay; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.barangay VALUES ('brgy-baybay', 'Brgy. Baybay', 'Baybay, Surigao City', 9.84, 125.53);
INSERT INTO public.barangay VALUES ('brgy-alegria', 'Brgy. Alegria', 'Alegria, Surigao City', 9.765, 125.41);
INSERT INTO public.barangay VALUES ('brgy-cagutsan', 'Brgy. Cagutsan', 'Cagutsan, Surigao City', 9.83, 125.49);
INSERT INTO public.barangay VALUES ('brgy-canlanipa', 'Brgy. Canlanipa', 'Canlanipa, Surigao City', 9.82, 125.47);
INSERT INTO public.barangay VALUES ('brgy-buenavista', 'Brgy. Buenavista', 'Buenavista, Surigao City', 9.735, 125.45);
INSERT INTO public.barangay VALUES ('brgy-cantiasay', 'Brgy. Cantiasay', 'Cantiasay, Surigao City', 9.795, 125.445);
INSERT INTO public.barangay VALUES ('brgy-cagniog', 'Brgy. Cagniog', 'Cagniog, Surigao City', 9.81, 125.48);
INSERT INTO public.barangay VALUES ('brgy-anomar', 'Brgy. Anomar', 'Anomar, Surigao City', 9.78, 125.4);
INSERT INTO public.barangay VALUES ('brgy-bilabid', 'Brgy. Bilabid', 'Bilabid, Surigao City', 9.85, 125.51);
INSERT INTO public.barangay VALUES ('brgy-capalayan', 'Brgy. Capalayan', 'Capalayan, Surigao City', 9.77, 125.44);
INSERT INTO public.barangay VALUES ('brgy-alang-alang', 'Brgy. Alang-alang', 'Alang-alang, Surigao City', 9.74, 125.42);
INSERT INTO public.barangay VALUES ('brgy-aurora', 'Brgy. Aurora', 'Aurora, Surigao City', 9.75, 125.43);
INSERT INTO public.barangay VALUES ('brgy-bitaugan', 'Brgy. Bitaugan', 'Bitaugan, Surigao City', 9.79, 125.41);
INSERT INTO public.barangay VALUES ('brgy-balibayon', 'Brgy. Balibayon', 'Balibayon, Surigao City', 9.82, 125.52);
INSERT INTO public.barangay VALUES ('brgy-catadman', 'Brgy. Catadman', 'Catadman, Surigao City', 9.815, 125.525);
INSERT INTO public.barangay VALUES ('brgy-danawan', 'Brgy. Danawan', 'Danawan, Surigao City', 9.795, 125.505);
INSERT INTO public.barangay VALUES ('brgy-danao', 'Brgy. Danao', 'Danao, Surigao City', 9.785, 125.515);
INSERT INTO public.barangay VALUES ('brgy-bonifacio', 'Brgy. Bonifacio', 'Bonifacio, Surigao City', 9.75, 125.465);
INSERT INTO public.barangay VALUES ('brgy-day-asan', 'Brgy. Day-asan', 'Day-asan, Surigao City', 9.8, 125.455);
INSERT INTO public.barangay VALUES ('brgy-ipil', 'Brgy. Ipil', 'Ipil, Surigao City', 9.76, 125.47);
INSERT INTO public.barangay VALUES ('brgy-lipata', 'Brgy. Lipata', 'Lipata, Surigao City', 9.755, 125.5);
INSERT INTO public.barangay VALUES ('brgy-libuac', 'Brgy. Libuac', 'Libuac, Surigao City', 9.745, 125.48);
INSERT INTO public.barangay VALUES ('brgy-lisondra', 'Brgy. Lisondra', 'Lisondra, Surigao City', 9.75, 125.49);
INSERT INTO public.barangay VALUES ('brgy-luna', 'Brgy. Luna', 'Luna, Surigao City', 9.74, 125.46);
INSERT INTO public.barangay VALUES ('brgy-mabini', 'Brgy. Mabini', 'Mabini, Surigao City', 9.765, 125.48);
INSERT INTO public.barangay VALUES ('brgy-mabua', 'Brgy. Mabua', 'Mabua, Surigao City', 9.755, 125.43);
INSERT INTO public.barangay VALUES ('brgy-cabongbongan', 'Brgy. Cabongbongan', 'Cabongbongan, Surigao City', 9.805, 125.54);
INSERT INTO public.barangay VALUES ('brgy-manyagao', 'Brgy. Manyagao', 'Manyagao, Surigao City', 9.77, 125.42);
INSERT INTO public.barangay VALUES ('brgy-mapawa', 'Brgy. Mapawa', 'Mapawa, Surigao City', 9.78, 125.43);
INSERT INTO public.barangay VALUES ('brgy-mat-i', 'Brgy. Mat-i', 'Mat-i, Surigao City', 9.762, 125.438);
INSERT INTO public.barangay VALUES ('brgy-nabago', 'Brgy. Nabago', 'Nabago, Surigao City', 9.8, 125.465);
INSERT INTO public.barangay VALUES ('brgy-nonoc', 'Brgy. Nonoc', 'Nonoc, Surigao City', 9.825, 125.55);
INSERT INTO public.barangay VALUES ('brgy-orok', 'Brgy. Orok', 'Orok, Surigao City', 9.73, 125.44);
INSERT INTO public.barangay VALUES ('brgy-punta-bilar', 'Brgy. Punta Bilar', 'Punta Bilar, Surigao City', 9.725, 125.45);
INSERT INTO public.barangay VALUES ('brgy-quezon', 'Brgy. Quezon', 'Quezon, Surigao City', 9.74, 125.45);
INSERT INTO public.barangay VALUES ('brgy-rizal', 'Brgy. Rizal', 'Rizal, Surigao City', 9.765, 125.455);
INSERT INTO public.barangay VALUES ('brgy-poctoy', 'Brgy. Poctoy', 'Poctoy, Surigao City', 9.735, 125.47);
INSERT INTO public.barangay VALUES ('brgy-san-roque', 'Brgy. San Roque', 'San Roque, Surigao City', 9.772, 125.488);
INSERT INTO public.barangay VALUES ('brgy-san-jose', 'Brgy. San Jose', 'San Jose, Surigao City', 9.77, 125.49);
INSERT INTO public.barangay VALUES ('brgy-san-pedro', 'Brgy. San Pedro', 'San Pedro, Surigao City', 9.785, 125.475);
INSERT INTO public.barangay VALUES ('brgy-san-juan', 'Brgy. San Juan', 'San Juan, Surigao City', 9.775, 125.47);
INSERT INTO public.barangay VALUES ('brgy-sabang', 'Brgy. Sabang', 'Sabang, Surigao City', 9.78, 125.455);
INSERT INTO public.barangay VALUES ('brgy-serna', 'Brgy. Serna', 'Serna, Surigao City', 9.76, 125.44);
INSERT INTO public.barangay VALUES ('brgy-san-isidro', 'Brgy. San Isidro', 'San Isidro, Surigao City', 9.75, 125.475);
INSERT INTO public.barangay VALUES ('brgy-silop', 'Brgy. Silop', 'Silop, Surigao City', 9.785, 125.49);
INSERT INTO public.barangay VALUES ('brgy-sugbay', 'Brgy. Sugbay', 'Sugbay, Surigao City', 9.75, 125.435);
INSERT INTO public.barangay VALUES ('brgy-sukailang', 'Brgy. Sukailang', 'Sukailang, Surigao City', 9.765, 125.425);
INSERT INTO public.barangay VALUES ('brgy-taft', 'Brgy. Taft', 'Taft, Surigao City', 9.77, 125.475);
INSERT INTO public.barangay VALUES ('brgy-sidlakan', 'Brgy. Sidlakan', 'Sidlakan, Surigao City', 9.795, 125.52);
INSERT INTO public.barangay VALUES ('brgy-talisay', 'Brgy. Talisay', 'Talisay, Surigao City', 9.73, 125.47);
INSERT INTO public.barangay VALUES ('brgy-togbongon', 'Brgy. Togbongon', 'Togbongon, Surigao City', 9.815, 125.46);
INSERT INTO public.barangay VALUES ('brgy-trinidad', 'Brgy. Trinidad', 'Trinidad, Surigao City', 9.755, 125.455);
INSERT INTO public.barangay VALUES ('brgy-zaragoza', 'Brgy. Zaragoza', 'Zaragoza, Surigao City', 9.8, 125.44);
INSERT INTO public.barangay VALUES ('brgy-washington', 'Brgy. Washington', 'Washington, Surigao City', 9.78, 125.485);


--
-- Data for Name: incidentreport; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: affectedperson; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: alert; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.alert VALUES ('cmj55af1b0000ja60sxng866x', 'Pagasa: Red rainfall alert in almost entire eastern Luzon due to Uwan', 'A red rainfall warning has been raised in almost all provinces on the eastern side of Luzon amid Typhoon UwanΓÇÖs expected onslaught, the Philippine Atmospheric, Geophysical and Astronomical Services Administration (Pagasa) said. | ≡ƒÄÑ : DOST-Pagasa', 'Luzon', '2025-12-14 03:08:09.487');
INSERT INTO public.alert VALUES ('cmj729du5000fjahw9ib9txe6', 'yolanda', 'super typhoon ', 'surigao del norte', '2025-12-15 11:18:54.758');


--
-- Data for Name: contact; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.contact VALUES ('cmj55pu37000eja60mh0pfjb2', 'Emergency Response Services', 'SURIGAO CITY EMERGENCY HOTLINES', '(0929-420-9511 ) - (0970-967-6338)', 'Others', '');
INSERT INTO public.contact VALUES ('cmj55r1vz000gja608xp5tiir', 'Provincial Disaster Risk Reduction & Management Office', 'SURIGAO CITY EMERGENCY HOTLINES', '0962-435-5720', 'NDRRMC', '');
INSERT INTO public.contact VALUES ('cmj55sb0b000ija60mrmhs267', 'Bureau of Fire Protection', 'SURIGAO CITY EMERGENCY HOTLINES', '(0931-721-8790 ) - (0955-214-8510) - (0926-226-0360)', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj55tl3z000kja608pqs37j3', 'Coast Guard Station ΓÇô Surigao del Norte', 'SURIGAO CITY EMERGENCY HOTLINES', '(0951-807-0127) - (0916-185-3901)', 'Others', '');
INSERT INTO public.contact VALUES ('cmj55umy0000mja60vgwnsfmf', 'Surigao City Police Station', 'SURIGAO CITY EMERGENCY HOTLINES', '(0998-539-8568) -  (0998-5987-328)', 'Police', '');
INSERT INTO public.contact VALUES ('cmj55vgsn000oja60sfp96789', 'Coast Guard Sub Station ΓÇô Surigao City', 'SURIGAO CITY EMERGENCY HOTLINES', '0985-046-0621', 'Others', '');
INSERT INTO public.contact VALUES ('cmj55w6aj000qja60p95zit5g', 'City Disaster Risk Reduction & Management Office', 'SURIGAO CITY EMERGENCY HOTLINES', '0951-517-6419', 'NDRRMC', '');
INSERT INTO public.contact VALUES ('cmj55wryu000sja60otlcrv7m', 'Coast Guard Sub Station ΓÇô Lipata', 'SURIGAO CITY EMERGENCY HOTLINES', '0966-421-4813', 'Others', '');
INSERT INTO public.contact VALUES ('cmj561iod000uja603iwd5cpg', 'DPFM Surigao del Norte', 'BUREAU OF FIRE PROTECTION', '(0931-721-8771) -  (0955-214-8460)', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj562n3x000wja60buw8awe6', 'Alegria Fire Station', 'BUREAU OF FIRE PROTECTION', '(0931-721-8772) - (0955-214-8461)', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj563ay8000yja60skjdmch9', 'Bacuag Fire Station', 'BUREAU OF FIRE PROTECTION', '0931-721-8773', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj563ufz0010ja60s9hfs2kv', 'Claver Central Fire Station', 'BUREAU OF FIRE PROTECTION', '0931-721-8775', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj564nh50012ja6024cyqxol', 'Cagdianao Fire Sub-Station', 'BUREAU OF FIRE PROTECTION', '(0931-721-8774) - (0955-214-8466)', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj565okm0014ja60yczbr5id', 'Gigaquit Fire Station', 'BUREAU OF FIRE PROTECTION', '(0931-721-8780) - (0926-865-1506)', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj566cu40016ja60rn6t9hox', 'Mainit Central Fire Station', 'BUREAU OF FIRE PROTECTION', '0931-721-8781', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj566xoi0018ja60bhbq08ti', 'Matin-ao Fire Sub-Station', 'BUREAU OF FIRE PROTECTION', '0951-903-8769', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj567qtw001aja60pq778ikt', 'Malimono Fire Station', 'BUREAU OF FIRE PROTECTION', '(0931-721-8782) - (0955-214-8484)', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj5692uw001cja60jwexzbl5', 'Placer Fire Station', 'BUREAU OF FIRE PROTECTION', '(0931-721-8784) - (0955-644-2758)', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj56biae001eja60swlyly32', 'Bad As Fire Sub-Station', 'BUREAU OF FIRE PROTECTION', '(0970-609-7143) - (0965-770-3047)', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj56c36e001gja60h1ewl8er', 'San Francisco Fire Station', 'BUREAU OF FIRE PROTECTION', '(0931-721-8785) - (0955-214-8490)', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj56cre3001ija60dxs9zdgv', 'Sison Fire Station', 'BUREAU OF FIRE PROTECTION', '(0970-713-5100) - (0965-887-5485)', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj56dc7i001kja60q4qnlmpd', 'Surigao City Central Fire Station', 'BUREAU OF FIRE PROTECTION', '(0931-721-8790) - (0926-226-0360)', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj56dwaw001mja60oaounkki', 'San Juan Fire Sub-Station', 'BUREAU OF FIRE PROTECTION', '0931-721-8786', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj56eg8y001oja60kyovh5n1', 'Fire Boat Fire Sub-Station', 'BUREAU OF FIRE PROTECTION', '0931-721-8782', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj56eykj001qja60ik7vyccx', 'Nabago Fire Sub-Station', 'BUREAU OF FIRE PROTECTION', '(0931-721-8783) - (0955-214-8485)', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj56fgvq001sja601174wr0n', 'Tagana-an Fire Station', 'BUREAU OF FIRE PROTECTION', '(0931-721-8791) - (0955-214-8514)', 'Fire', '');
INSERT INTO public.contact VALUES ('cmj56fypi001uja60mjzciec0', 'Tubod Fire Station', 'BUREAU OF FIRE PROTECTION', '(0931-721-8792) - (0910-574-2875) - (0995-572-6528)', 'Fire', '');


--
-- Data for Name: evaccenter; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: logentry; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.logentry VALUES ('cmimwzew20001jac43yw8txrz', 'info', 'Create News/Video', '{"title":"hhh"}', '2025-12-01 08:55:48.002');
INSERT INTO public.logentry VALUES ('cmimx00ij0003jac48f6kr7ig', 'info', 'Create Emergency Contact', '{"name":"Lorna Jee Aure"}', '2025-12-01 08:56:16.028');
INSERT INTO public.logentry VALUES ('cmimzbg3l0007jac4knztd463', 'info', 'Create News/Video', '{"title":"dhdhdh"}', '2025-12-01 10:01:08.673');
INSERT INTO public.logentry VALUES ('cmimziqmw0002jaekbwqvgba9', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-01 10:06:48.92');
INSERT INTO public.logentry VALUES ('cmimzk7be0005jaek9gdwggys', 'info', 'Create Evac Center', '{"name":"Joseph M. Bayang"}', '2025-12-01 10:07:57.194');
INSERT INTO public.logentry VALUES ('cmimznm370008jaek9d183az3', 'info', 'Create Evac Center', '{"name":"Joseph M. Bayang"}', '2025-12-01 10:10:36.307');
INSERT INTO public.logentry VALUES ('cmimzob7m000bjaekku0xahxx', 'info', 'Create Evac Center', '{"name":"Lorna Jee Aure"}', '2025-12-01 10:11:08.866');
INSERT INTO public.logentry VALUES ('cmimzoqev000ejaekietjurkz', 'info', 'Create Evac Center', '{"name":"Joseph M. Bayang"}', '2025-12-01 10:11:28.567');
INSERT INTO public.logentry VALUES ('cmimzpgzh000hjaeku5r7o0v5', 'info', 'Create Evac Center', '{"name":"PLAZA, ELMO L."}', '2025-12-01 10:12:03.005');
INSERT INTO public.logentry VALUES ('cmimzq1y3000kjaek2mzr41ej', 'info', 'Create Official Incident Report: Fire', '{"type":"Fire","urgency":"Low","barangayId":"brgy-serna"}', '2025-12-01 10:12:30.171');
INSERT INTO public.logentry VALUES ('cmimztuv9000ljaekf5n5a4v5', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-01 10:15:27.621');
INSERT INTO public.logentry VALUES ('cmimzz0n1000ojaek8a924ie5', 'info', 'Create Official Incident Report: Fire', '{"type":"Fire","urgency":"Low","barangayId":"brgy-serna"}', '2025-12-01 10:19:28.377');
INSERT INTO public.logentry VALUES ('cmimzzgjr000pjaekrncv8ymz', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-01 10:19:49');
INSERT INTO public.logentry VALUES ('cmin06yjs000sjaek3lmlaihp', 'info', 'Create Official Incident Report: Earthquake', '{"type":"Earthquake","urgency":"Low","barangayId":"brgy-serna"}', '2025-12-01 10:25:38.921');
INSERT INTO public.logentry VALUES ('cmin07cuu000tjaekb9yqt7rh', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-01 10:25:57.46');
INSERT INTO public.logentry VALUES ('cmin0ctc9000wjaekaslmqmwp', 'info', 'Create Official Incident Report: Fire', '{"type":"Fire","urgency":"Low","barangayId":"brgy-serna"}', '2025-12-01 10:30:12.106');
INSERT INTO public.logentry VALUES ('cmin0da7y000xjaek4acl98or', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-01 10:30:33.982');
INSERT INTO public.logentry VALUES ('cmin0z36v0001ja2k93a0w8o3', 'info', 'Create User', '{"username":"Poctoy","role":"barangay"}', '2025-12-01 10:47:31.303');
INSERT INTO public.logentry VALUES ('cmin1jdkb0001jaukxg5rio8q', 'info', 'Create User', '{"username":"Poctoy","role":"barangay"}', '2025-12-01 11:03:17.868');
INSERT INTO public.logentry VALUES ('cmin1qcbh0001jamo5yg6whgt', 'info', 'Create User', '{"username":"Poctoy","role":"guest"}', '2025-12-01 11:08:42.846');
INSERT INTO public.logentry VALUES ('cmin5ws3e0002jatk3b9tledc', 'info', 'Update User', '{"changes":["username","email","role","isActive","barangayId"]}', '2025-12-01 13:05:41.689');
INSERT INTO public.logentry VALUES ('cmin5y7pa0003jatks0k2snl9', 'info', 'Update User', '{"changes":["username","email","role","isActive","barangayId"]}', '2025-12-01 13:06:48.574');
INSERT INTO public.logentry VALUES ('cmin66hrl0005jatkiz7kh27e', 'info', 'Create User', '{"username":"rizal","role":"barangay","barangayId":"brgy-rizal"}', '2025-12-01 13:13:14.865');
INSERT INTO public.logentry VALUES ('cmin6dq5v0001jap8uvl0l96p', 'info', 'Create User', '{"username":"sanroque","role":"barangay","barangayId":"brgy-san-roque"}', '2025-12-01 13:18:52.34');
INSERT INTO public.logentry VALUES ('cmin6zlht0001jamo0etdar1i', 'info', 'Create User', '{"username":"mat-i","role":"barangay","barangayId":"brgy-mat-i"}', '2025-12-01 13:35:52.721');
INSERT INTO public.logentry VALUES ('cmin7irli0000jae8gnhdpuza', 'info', 'Update User', '{"changes":["username","email","role","isActive","barangayId"]}', '2025-12-01 13:50:47.095');
INSERT INTO public.logentry VALUES ('cmin7j3170001jae8950d3lj0', 'info', 'Update User', '{"changes":["username","email","role","isActive","barangayId"]}', '2025-12-01 13:51:01.916');
INSERT INTO public.logentry VALUES ('cmin89ole0000jajw2jcxdw3u', 'info', 'Delete User', NULL, '2025-12-01 14:11:42.914');
INSERT INTO public.logentry VALUES ('cmin8a67n0002jajwu51qkb8n', 'info', 'Create User', '{"username":"mati","role":"barangay","barangayId":"brgy-mat-i"}', '2025-12-01 14:12:05.748');
INSERT INTO public.logentry VALUES ('cminv20xq0002jamgjyyd9y8p', 'info', 'Create Evacuation Center', '{"name":"Lorna Jee Aure"}', '2025-12-02 00:49:36.83');
INSERT INTO public.logentry VALUES ('cminvopaq0002jaw40v73md9b', 'info', 'Create Evacuation Center', '{"name":"PLAZA, ELMO L."}', '2025-12-02 01:07:14.834');
INSERT INTO public.logentry VALUES ('cminvsxs90005jaw4iegxbwpq', 'info', 'Create Evacuation Center', '{"name":"Lorna Jee Aure"}', '2025-12-02 01:10:32.458');
INSERT INTO public.logentry VALUES ('cminvxtqn0008jaw4ygrhchps', 'info', 'Create Evacuation Center', '{"name":"PLAZA, ELMO L.1"}', '2025-12-02 01:14:20.495');
INSERT INTO public.logentry VALUES ('cminw2vql000bjaw4e9tp44v6', 'info', 'Create Evacuation Center', '{"name":"Joseph M. Bayang"}', '2025-12-02 01:18:16.365');
INSERT INTO public.logentry VALUES ('cminw7wlu000ejaw429yv5h83', 'info', 'Create Evacuation Center', '{"name":"Lorna Jee Aure"}', '2025-12-02 01:22:10.77');
INSERT INTO public.logentry VALUES ('cminw8aap000fjaw4b4v71eor', 'info', 'Update Evacuation Center', '{"changes":["name","address","capacity","currentOccupancy","contact","status","barangayId","services","imageUrl","location"]}', '2025-12-02 01:22:28.513');
INSERT INTO public.logentry VALUES ('cminw93da000ijaw41tj6xpe3', 'info', 'Create Evacuation Center', '{"name":"PLAZA, ELMO L.12"}', '2025-12-02 01:23:06.191');
INSERT INTO public.logentry VALUES ('cminwaa2a000jjaw43yvqleqe', 'info', 'Update Evacuation Center', '{"changes":["name","address","capacity","currentOccupancy","contact","status","barangayId","services","imageUrl","location"]}', '2025-12-02 01:24:01.522');
INSERT INTO public.logentry VALUES ('cminwao3s000kjaw44bp7n0tm', 'info', 'Update Evacuation Center', '{"changes":["name","address","capacity","currentOccupancy","contact","status","barangayId","services","imageUrl","location"]}', '2025-12-02 01:24:19.72');
INSERT INTO public.logentry VALUES ('cminwb1oe000ljaw4y8jr4uer', 'info', 'Update Evacuation Center', '{"changes":["name","address","capacity","currentOccupancy","contact","status","barangayId","services","imageUrl","location"]}', '2025-12-02 01:24:37.31');
INSERT INTO public.logentry VALUES ('cminwh3vv000mjaw4hnoiouzk', 'info', 'Update Evacuation Center', '{"changes":["name","address","capacity","currentOccupancy","contact","status","barangayId","services","imageUrl","location"]}', '2025-12-02 01:29:20.107');
INSERT INTO public.logentry VALUES ('cminwlrx7000njaw40mddofsp', 'info', 'Update Evacuation Center', '{"changes":["name","address","capacity","currentOccupancy","contact","status","barangayId","services","imageUrl","location"]}', '2025-12-02 01:32:57.883');
INSERT INTO public.logentry VALUES ('cminwmcka000qjaw4swkdt52z', 'info', 'Create Evacuation Center', '{"name":"PLAZA, ELMO L.122"}', '2025-12-02 01:33:24.635');
INSERT INTO public.logentry VALUES ('cminwoyhr000rjaw4attgymjr', 'info', 'Update Evacuation Center', '{"changes":["name","address","capacity","currentOccupancy","contact","status","barangayId","services","imageUrl","location"]}', '2025-12-02 01:35:26.367');
INSERT INTO public.logentry VALUES ('cminwu3m70000ja00g8i7q1pa', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-02 01:39:26.286');
INSERT INTO public.logentry VALUES ('cminxepy90000jal8fxsl2yia', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-02 01:55:28.353');
INSERT INTO public.logentry VALUES ('cminxeqfu0001jal81ekul44r', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-02 01:55:28.986');
INSERT INTO public.logentry VALUES ('cminxeqqv0002jal899uz2ahq', 'info', 'Update Incident Report', '{"status":"Published","adminNotes":"Published for guest viewing"}', '2025-12-02 01:55:29.383');
INSERT INTO public.logentry VALUES ('cminynzqa0002jakw3hv08pck', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-02 02:30:40.545');
INSERT INTO public.logentry VALUES ('cminyo0wy0003jakw83aqit3u', 'info', 'Update Incident Report', '{"status":"Published","adminNotes":"Published for guest viewing"}', '2025-12-02 02:30:42.082');
INSERT INTO public.logentry VALUES ('cminytcnz0006jakwa4pb7muo', 'info', 'Create Official Incident Report: Landslide', '{"type":"Landslide","urgency":"Low","barangayId":"brgy-mat-i"}', '2025-12-02 02:34:50.591');
INSERT INTO public.logentry VALUES ('cminyu38z0007jakw04tkx4h1', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-02 02:35:25.043');
INSERT INTO public.logentry VALUES ('cminyv91v0008jakwsrh2gzdy', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-02 02:36:19.22');
INSERT INTO public.logentry VALUES ('cminz17o2000bjakwm9qsl8s9', 'info', 'Create Official Incident Report: Fire', '{"type":"Fire","urgency":"High","barangayId":"brgy-mat-i","images":1}', '2025-12-02 02:40:57.362');
INSERT INTO public.logentry VALUES ('cmj54yy7y000wja6wwvtyrobs', 'info', 'Delete Incident Report', NULL, '2025-12-14 02:59:14.495');
INSERT INTO public.logentry VALUES ('cminznyuv000cjakwpfnz2o1m', 'info', 'Update Evacuation Center', '{"changes":["name","address","capacity","currentOccupancy","contact","status","barangayId","services","imageUrl","location"]}', '2025-12-02 02:58:39.03');
INSERT INTO public.logentry VALUES ('cmiodpcdh0001jaz87119pasd', 'info', 'Create User', '{"username":"danao","role":"barangay","barangayId":"brgy-danao"}', '2025-12-02 09:31:37.829');
INSERT INTO public.logentry VALUES ('cmir9blui0002ja7sdkfe4hl8', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-04 09:52:16.986');
INSERT INTO public.logentry VALUES ('cmir9bov90003ja7s2anyfvga', 'info', 'Update Incident Report', '{"status":"Published","adminNotes":"Published for guest viewing"}', '2025-12-04 09:52:20.902');
INSERT INTO public.logentry VALUES ('cmir9dbmw0006ja7s4984tn8s', 'info', 'Create Evacuation Center', '{"name":"Ellonzo Bldg"}', '2025-12-04 09:53:37.064');
INSERT INTO public.logentry VALUES ('cmir9jb2s0008ja7s6tek61u6', 'info', 'Create Emergency Alert', '{"title":"Typhoon Elmo "}', '2025-12-04 09:58:16.146');
INSERT INTO public.logentry VALUES ('cmir9lrsg000bja7sduup4ojp', 'info', 'Create Official Incident Report: Earthquake', '{"type":"Earthquake","urgency":"High","barangayId":"brgy-mat-i","images":0}', '2025-12-04 10:00:11.249');
INSERT INTO public.logentry VALUES ('cmir9mif3000cja7sijwogky6', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-04 10:00:45.759');
INSERT INTO public.logentry VALUES ('cmir9migc000dja7svawqzaao', 'info', 'Update Incident Report', '{"status":"Published","adminNotes":"Published for guest viewing"}', '2025-12-04 10:00:45.804');
INSERT INTO public.logentry VALUES ('cmir9o0rc000eja7s6s5lkpv8', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-04 10:01:56.185');
INSERT INTO public.logentry VALUES ('cmirawidh0000jaroyqvm56ko', 'info', 'Update Incident Report', '{"status":"Published","adminNotes":"Published for guest viewing"}', '2025-12-04 10:36:31.877');
INSERT INTO public.logentry VALUES ('cmiy1jeph0002ja7ouamlhk2f', 'info', 'Create Evacuation Center', '{"name":"baho"}', '2025-12-09 03:48:47.285');
INSERT INTO public.logentry VALUES ('cmiy2hzfi0003ja7ox65hx9gg', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-09 04:15:40.446');
INSERT INTO public.logentry VALUES ('cmiy2hzx80004ja7oz0a0gzmx', 'info', 'Update Incident Report', '{"status":"Published","adminNotes":"Published for guest viewing"}', '2025-12-09 04:15:41.084');
INSERT INTO public.logentry VALUES ('cmiy2i0590005ja7ouvxsn3z3', 'info', 'Update Incident Report', '{"status":"Published","adminNotes":"Published for guest viewing"}', '2025-12-09 04:15:41.374');
INSERT INTO public.logentry VALUES ('cmiy2i2ox0006ja7ovl3zvnpc', 'info', 'Update Incident Report', '{"status":"Published","adminNotes":"Published for guest viewing"}', '2025-12-09 04:15:44.674');
INSERT INTO public.logentry VALUES ('cmiy2i52k0007ja7ofvgw4s07', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-09 04:15:47.756');
INSERT INTO public.logentry VALUES ('cmiy2i6mc0008ja7op6nzb0t1', 'info', 'Update Incident Report', '{"status":"Published","adminNotes":"Published for guest viewing"}', '2025-12-09 04:15:49.765');
INSERT INTO public.logentry VALUES ('cmj5303n60000jaew3njzhn0z', 'info', 'Delete News/Video', NULL, '2025-12-14 02:04:08.945');
INSERT INTO public.logentry VALUES ('cmj5308b00001jaew58huqemi', 'info', 'Delete News/Video', NULL, '2025-12-14 02:04:14.989');
INSERT INTO public.logentry VALUES ('cmj530hlo0002jaewcq5vbflb', 'info', 'Delete News/Video', NULL, '2025-12-14 02:04:27.036');
INSERT INTO public.logentry VALUES ('cmj530o7c0003jaewa5d1hf9y', 'info', 'Delete News/Video', NULL, '2025-12-14 02:04:35.592');
INSERT INTO public.logentry VALUES ('cmj530u010004jaew9ugi8j4z', 'info', 'Delete News/Video', NULL, '2025-12-14 02:04:43.105');
INSERT INTO public.logentry VALUES ('cmj530y6d0005jaewmco3z67b', 'info', 'Delete News/Video', NULL, '2025-12-14 02:04:48.517');
INSERT INTO public.logentry VALUES ('cmj53152x0006jaew6z0lsec4', 'info', 'Delete News/Video', NULL, '2025-12-14 02:04:57.465');
INSERT INTO public.logentry VALUES ('cmj5318b60007jaewtwbieks3', 'info', 'Delete News/Video', NULL, '2025-12-14 02:05:01.65');
INSERT INTO public.logentry VALUES ('cmj531j6k0008jaew0i7oz4wu', 'info', 'Delete News/Video', NULL, '2025-12-14 02:05:15.74');
INSERT INTO public.logentry VALUES ('cmj531m8o0009jaew9ofw18te', 'info', 'Delete News/Video', NULL, '2025-12-14 02:05:19.705');
INSERT INTO public.logentry VALUES ('cmj531osa000ajaewaffrfmnj', 'info', 'Delete News/Video', NULL, '2025-12-14 02:05:23.002');
INSERT INTO public.logentry VALUES ('cmj531rao000bjaew4gu6k0gs', 'info', 'Delete News/Video', NULL, '2025-12-14 02:05:26.256');
INSERT INTO public.logentry VALUES ('cmj531ugv000cjaewz1xsb2br', 'info', 'Delete News/Video', NULL, '2025-12-14 02:05:30.367');
INSERT INTO public.logentry VALUES ('cmj534057000ejaew10hoctsd', 'info', 'Create News/Video', '{"title":"Public Weather Forecast issued at 5 PM | December 08, 2025 - Monday"}', '2025-12-14 02:07:11.036');
INSERT INTO public.logentry VALUES ('cmj539vpe0000jas8vsmo5ybu', 'info', 'Update News/Video', '{"changes":["id","title","content","category","mediaType","mediaUrl","thumbnailUrl","publishedAt","author","source"]}', '2025-12-14 02:11:45.218');
INSERT INTO public.logentry VALUES ('cmj53a86g0001jas88ypu5eg0', 'info', 'Update News/Video', '{"changes":["id","title","content","category","mediaType","mediaUrl","thumbnailUrl","publishedAt","author","source"]}', '2025-12-14 02:12:01.384');
INSERT INTO public.logentry VALUES ('cmj53gxrt0002jas896qvu6td', 'info', 'Update News/Video', '{"changes":["id","title","content","category","mediaType","mediaUrl","thumbnailUrl","publishedAt","author","source"]}', '2025-12-14 02:17:14.489');
INSERT INTO public.logentry VALUES ('cmj53kd4v0000jacc16z73lfp', 'info', 'Update News/Video', '{"changes":["id","title","content","category","mediaType","mediaUrl","thumbnailUrl","publishedAt","author","source"]}', '2025-12-14 02:19:54.367');
INSERT INTO public.logentry VALUES ('cmj53px410000jahwwdumzl3u', 'info', 'Update News/Video', '{"changes":["id","title","content","category","mediaType","mediaUrl","thumbnailUrl","publishedAt","author","source"]}', '2025-12-14 02:24:13.538');
INSERT INTO public.logentry VALUES ('cmj53yrra0000ja6wkaoze4rd', 'info', 'Update News/Video', '{"changes":["id","title","content","category","mediaType","mediaUrl","thumbnailUrl","publishedAt","author","source"]}', '2025-12-14 02:31:06.503');
INSERT INTO public.logentry VALUES ('cmj53z1mp0001ja6wldw66yy5', 'info', 'Update News/Video', '{"changes":["id","title","content","category","mediaType","mediaUrl","thumbnailUrl","publishedAt","author","source"]}', '2025-12-14 02:31:19.297');
INSERT INTO public.logentry VALUES ('cmj544ius0003ja6wwr9ofxki', 'info', 'Create News/Video', '{"title":"Public Weather Forecast issued at 5 AM | December 09, 2025 - Tuesday"}', '2025-12-14 02:35:34.9');
INSERT INTO public.logentry VALUES ('cmj546d4f0005ja6w9l47azc1', 'info', 'Create News/Video', '{"title":"agaghagagha"}', '2025-12-14 02:37:00.783');
INSERT INTO public.logentry VALUES ('cmj547iz90006ja6w8d3ipcyx', 'info', 'Delete News/Video', NULL, '2025-12-14 02:37:55.03');
INSERT INTO public.logentry VALUES ('cmj547ltt0007ja6wkzr3ydm3', 'info', 'Delete News/Video', NULL, '2025-12-14 02:37:58.721');
INSERT INTO public.logentry VALUES ('cmj547ori0008ja6wcoocgi43', 'info', 'Delete News/Video', NULL, '2025-12-14 02:38:02.526');
INSERT INTO public.logentry VALUES ('cmj54ad94000aja6wcyddv26n', 'info', 'Create News/Video', '{"title":"Weather update as of 6:25 AM (September 22, 2025) | Unang Balita"}', '2025-12-14 02:40:07.576');
INSERT INTO public.logentry VALUES ('cmj54cyxj000cja6wbn8uc7uw', 'info', 'Create News/Video', '{"title":"Stronger ''amihan'' surge expected; shear line to bring rains as PAGASA rules out cyclone in the comin"}', '2025-12-14 02:42:08.983');
INSERT INTO public.logentry VALUES ('cmj54erx4000eja6w58a512xk', 'info', 'Create News/Video', '{"title":"Bagyong Wilma, posibleng tawirin ang Visayas ngayong gabi | 24 Oras Weekend"}', '2025-12-14 02:43:33.209');
INSERT INTO public.logentry VALUES ('cmj54g8xn000gja6w90n8j3ls', 'info', 'Create News/Video', '{"title":"Weather update as of 6AM (October 17, 2025) | Unang Balita"}', '2025-12-14 02:44:41.916');
INSERT INTO public.logentry VALUES ('cmj54hh0c000ija6wb3zr4nxd', 'info', 'Create News/Video', '{"title":"Bagyong Ramil, posibleng tumama at tumawid sa lupa ngayong weekend | 24 Oras"}', '2025-12-14 02:45:39.036');
INSERT INTO public.logentry VALUES ('cmj54o8ih000kja6w16df972c', 'info', 'Create News/Video', '{"title":"PAGASA - May 70% tsansang magkaroon ng La Ni├▒a mula October-December 2025 | Balitanghali"}', '2025-12-14 02:50:54.617');
INSERT INTO public.logentry VALUES ('cmj54q018000mja6w5zxgbe9k', 'info', 'Create News/Video', '{"title":"Sunog sa Brgy. Pleasant Hills, Mandaluyong City, umabot ng ikalimang alarma | GMA Integrated News"}', '2025-12-14 02:52:16.94');
INSERT INTO public.logentry VALUES ('cmj54rpog000oja6wvlgumcvz', 'info', 'Create News/Video', '{"title":"Sunog, sumiklab sa residential area 13 araw bago mag-Pasko | Saksi"}', '2025-12-14 02:53:36.833');
INSERT INTO public.logentry VALUES ('cmj54t813000qja6wwh4auteh', 'info', 'Create News/Video', '{"title":"3 injured in huge Happyland fire | 24 Oras Weekend"}', '2025-12-14 02:54:47.271');
INSERT INTO public.logentry VALUES ('cmj54vlku000sja6wq1vql0jl', 'info', 'Create News/Video', '{"title":"APEKTADO SA SUNOG SA SURIGAO CITY, MISAKA SA 139"}', '2025-12-14 02:56:38.142');
INSERT INTO public.logentry VALUES ('cmj54wy2e000tja6w86eh1s32', 'info', 'Delete News/Video', NULL, '2025-12-14 02:57:40.982');
INSERT INTO public.logentry VALUES ('cmj54x485000uja6wky06xo63', 'info', 'Delete News/Video', NULL, '2025-12-14 02:57:48.965');
INSERT INTO public.logentry VALUES ('cmj54yuya000vja6wqwrrykh5', 'info', 'Delete Incident Report', NULL, '2025-12-14 02:59:10.259');
INSERT INTO public.logentry VALUES ('cmj54z1qu000xja6wy30i2bdg', 'info', 'Delete Incident Report', NULL, '2025-12-14 02:59:19.062');
INSERT INTO public.logentry VALUES ('cmj54z3l7000yja6wldww64an', 'info', 'Delete Incident Report', NULL, '2025-12-14 02:59:21.451');
INSERT INTO public.logentry VALUES ('cmj54z6qf000zja6woskwl36o', 'info', 'Delete Incident Report', NULL, '2025-12-14 02:59:25.528');
INSERT INTO public.logentry VALUES ('cmj54z9nv0010ja6w7gf8t834', 'info', 'Delete Incident Report', NULL, '2025-12-14 02:59:29.323');
INSERT INTO public.logentry VALUES ('cmj54zd1t0011ja6w47brz0iy', 'info', 'Delete Incident Report', NULL, '2025-12-14 02:59:33.714');
INSERT INTO public.logentry VALUES ('cmj54zfnh0012ja6wawbofu1q', 'info', 'Delete Incident Report', NULL, '2025-12-14 02:59:37.085');
INSERT INTO public.logentry VALUES ('cmj54zjdm0013ja6woztip393', 'info', 'Delete Incident Report', NULL, '2025-12-14 02:59:41.915');
INSERT INTO public.logentry VALUES ('cmj54zlam0014ja6wr26qx0vo', 'info', 'Delete Incident Report', NULL, '2025-12-14 02:59:44.398');
INSERT INTO public.logentry VALUES ('cmj54zo5l0015ja6w81vro6yl', 'info', 'Delete Incident Report', NULL, '2025-12-14 02:59:48.105');
INSERT INTO public.logentry VALUES ('cmj54zqy30016ja6w7ynpif8p', 'info', 'Delete Incident Report', NULL, '2025-12-14 02:59:51.724');
INSERT INTO public.logentry VALUES ('cmj54ztj50017ja6w9cno0gkb', 'info', 'Delete Incident Report', NULL, '2025-12-14 02:59:55.074');
INSERT INTO public.logentry VALUES ('cmj54zwjm0018ja6wml7doj5g', 'info', 'Delete Incident Report', NULL, '2025-12-14 02:59:58.979');
INSERT INTO public.logentry VALUES ('cmj54zyuz0019ja6w60wizhbe', 'info', 'Delete Incident Report', NULL, '2025-12-14 03:00:01.979');
INSERT INTO public.logentry VALUES ('cmj55020g001aja6wrbwn8ite', 'info', 'Delete Incident Report', NULL, '2025-12-14 03:00:06.065');
INSERT INTO public.logentry VALUES ('cmj550bgt001bja6wcdj8jidh', 'info', 'Delete Emergency Alert', NULL, '2025-12-14 03:00:18.318');
INSERT INTO public.logentry VALUES ('cmj550ebs001cja6wu89slk7i', 'info', 'Delete Emergency Alert', NULL, '2025-12-14 03:00:22.024');
INSERT INTO public.logentry VALUES ('cmj550qrj001dja6wr997mx9x', 'info', 'Delete Emergency Alert', NULL, '2025-12-14 03:00:38.144');
INSERT INTO public.logentry VALUES ('cmj550u0p001eja6wd58ssqzx', 'info', 'Delete Emergency Alert', NULL, '2025-12-14 03:00:42.361');
INSERT INTO public.logentry VALUES ('cmj55506s0001jai4bqxc6uyp', 'info', 'Create Emergency Alert', '{"title":"amo ting"}', '2025-12-14 03:03:56.981');
INSERT INTO public.logentry VALUES ('cmj55864k0001jamoqf1fuolx', 'info', 'Create Emergency Alert', '{"title":"mmm"}', '2025-12-14 03:06:24.645');
INSERT INTO public.logentry VALUES ('cmj5589oq0002jamo6a6fghz2', 'info', 'Delete Emergency Alert', NULL, '2025-12-14 03:06:29.259');
INSERT INTO public.logentry VALUES ('cmj55af8w0001ja60gvfw5k60', 'info', 'Create Emergency Alert', '{"title":"Pagasa: Red rainfall alert in almost entire eastern Luzon due to Uwan"}', '2025-12-14 03:08:09.57');
INSERT INTO public.logentry VALUES ('cmj55br0z0002ja60h6gpcmu5', 'info', 'Delete Evacuation Center', NULL, '2025-12-14 03:09:11.7');
INSERT INTO public.logentry VALUES ('cmj55bv8o0003ja60jpogrzmn', 'info', 'Delete Evacuation Center', NULL, '2025-12-14 03:09:17.161');
INSERT INTO public.logentry VALUES ('cmj55bzcy0004ja60qmbx280j', 'info', 'Delete Evacuation Center', NULL, '2025-12-14 03:09:22.498');
INSERT INTO public.logentry VALUES ('cmj55c2c20005ja60qkuddb0v', 'info', 'Delete Evacuation Center', NULL, '2025-12-14 03:09:26.354');
INSERT INTO public.logentry VALUES ('cmj55c5gl0006ja60u2l8nmhi', 'info', 'Delete Evacuation Center', NULL, '2025-12-14 03:09:30.405');
INSERT INTO public.logentry VALUES ('cmj55c8qy0007ja604j4ilpo0', 'info', 'Delete Evacuation Center', NULL, '2025-12-14 03:09:34.665');
INSERT INTO public.logentry VALUES ('cmj55cbgc0008ja606hliy9l9', 'info', 'Delete Evacuation Center', NULL, '2025-12-14 03:09:38.173');
INSERT INTO public.logentry VALUES ('cmj55ce320009ja60l1zklkz5', 'info', 'Delete Evacuation Center', NULL, '2025-12-14 03:09:41.583');
INSERT INTO public.logentry VALUES ('cmj55cgys000aja60pwxoyak0', 'info', 'Delete Evacuation Center', NULL, '2025-12-14 03:09:45.316');
INSERT INTO public.logentry VALUES ('cmj55cjtw000bja60gednwong', 'info', 'Delete Evacuation Center', NULL, '2025-12-14 03:09:49.028');
INSERT INTO public.logentry VALUES ('cmj55cnth000cja60cfmpl4w9', 'info', 'Delete Emergency Contact', NULL, '2025-12-14 03:09:54.197');
INSERT INTO public.logentry VALUES ('cmj55cqko000dja606wd0xhfa', 'info', 'Delete Emergency Contact', NULL, '2025-12-14 03:09:57.769');
INSERT INTO public.logentry VALUES ('cmj55pu4t000fja6013jfbzw0', 'info', 'Create Emergency Contact', '{"name":"Emergency Response Services"}', '2025-12-14 03:20:08.909');
INSERT INTO public.logentry VALUES ('cmj55r1wl000hja6009edg5ge', 'info', 'Create Emergency Contact', '{"name":"Provincial Disaster Risk Reduction & Management Office"}', '2025-12-14 03:21:05.637');
INSERT INTO public.logentry VALUES ('cmj55sb14000jja60t5rkqebi', 'info', 'Create Emergency Contact', '{"name":"Bureau of Fire Protection"}', '2025-12-14 03:22:04.12');
INSERT INTO public.logentry VALUES ('cmj55tl4k000lja60le2n1i1h', 'info', 'Create Emergency Contact', '{"name":"Coast Guard Station ΓÇô Surigao del Norte"}', '2025-12-14 03:23:03.861');
INSERT INTO public.logentry VALUES ('cmj55un2n000nja60o0pmgvy5', 'info', 'Create Emergency Contact', '{"name":"Surigao City Police Station"}', '2025-12-14 03:23:53.037');
INSERT INTO public.logentry VALUES ('cmj55vgt5000pja605ipr0o3m', 'info', 'Create Emergency Contact', '{"name":"Coast Guard Sub Station ΓÇô Surigao City"}', '2025-12-14 03:24:31.577');
INSERT INTO public.logentry VALUES ('cmj55w6be000rja601nckdc9r', 'info', 'Create Emergency Contact', '{"name":"City Disaster Risk Reduction & Management Office"}', '2025-12-14 03:25:04.635');
INSERT INTO public.logentry VALUES ('cmj55ws0r000tja60dr2zfjc3', 'info', 'Create Emergency Contact', '{"name":"Coast Guard Sub Station ΓÇô Lipata"}', '2025-12-14 03:25:32.764');
INSERT INTO public.logentry VALUES ('cmj561ir7000vja608gy31rsc', 'info', 'Create Emergency Contact', '{"name":"DPFM Surigao del Norte"}', '2025-12-14 03:29:14.035');
INSERT INTO public.logentry VALUES ('cmj562n5s000xja60b59ntdyx', 'info', 'Create Emergency Contact', '{"name":"Alegria Fire Station"}', '2025-12-14 03:30:06.401');
INSERT INTO public.logentry VALUES ('cmj563b1t000zja60bmdcms6w', 'info', 'Create Emergency Contact', '{"name":"Bacuag Fire Station"}', '2025-12-14 03:30:37.361');
INSERT INTO public.logentry VALUES ('cmj563uhp0011ja603olc9yv5', 'info', 'Create Emergency Contact', '{"name":"Claver Central Fire Station"}', '2025-12-14 03:31:02.558');
INSERT INTO public.logentry VALUES ('cmj564nj20013ja60i26l8uze', 'info', 'Create Emergency Contact', '{"name":"Cagdianao Fire Sub-Station"}', '2025-12-14 03:31:40.19');
INSERT INTO public.logentry VALUES ('cmj565olx0015ja60avywa4z1', 'info', 'Create Emergency Contact', '{"name":"Gigaquit Fire Station"}', '2025-12-14 03:32:28.245');
INSERT INTO public.logentry VALUES ('cmj566cwv0017ja60tfmx0m1j', 'info', 'Create Emergency Contact', '{"name":"Mainit Central Fire Station"}', '2025-12-14 03:32:59.744');
INSERT INTO public.logentry VALUES ('cmj566y550019ja606oaz56ai', 'info', 'Create Emergency Contact', '{"name":"Matin-ao Fire Sub-Station"}', '2025-12-14 03:33:27.258');
INSERT INTO public.logentry VALUES ('cmj567qwl001bja607clw6o64', 'info', 'Create Emergency Contact', '{"name":"Malimono Fire Station"}', '2025-12-14 03:34:04.507');
INSERT INTO public.logentry VALUES ('cmj5692yk001dja60rbh582sj', 'info', 'Create Emergency Contact', '{"name":"Placer Fire Station"}', '2025-12-14 03:35:06.812');
INSERT INTO public.logentry VALUES ('cmj56bid6001fja60jfzwkl5l', 'info', 'Create Emergency Contact', '{"name":"Bad As Fire Sub-Station"}', '2025-12-14 03:37:00.09');
INSERT INTO public.logentry VALUES ('cmj56c4ol001hja60308gb579', 'info', 'Create Emergency Contact', '{"name":"San Francisco Fire Station"}', '2025-12-14 03:37:29.012');
INSERT INTO public.logentry VALUES ('cmj56crz3001jja600htw89nf', 'info', 'Create Emergency Contact', '{"name":"Sison Fire Station"}', '2025-12-14 03:37:59.199');
INSERT INTO public.logentry VALUES ('cmj56dcrj001lja60k65apms1', 'info', 'Create Emergency Contact', '{"name":"Surigao City Central Fire Station"}', '2025-12-14 03:38:26.144');
INSERT INTO public.logentry VALUES ('cmj56dwfj001nja60xoegl0lm', 'info', 'Create Emergency Contact', '{"name":"San Juan Fire Sub-Station"}', '2025-12-14 03:38:51.632');
INSERT INTO public.logentry VALUES ('cmj56egcy001pja605yw2ei45', 'info', 'Create Emergency Contact', '{"name":"Fire Boat Fire Sub-Station"}', '2025-12-14 03:39:17.459');
INSERT INTO public.logentry VALUES ('cmj56eyor001rja60cjo640d7', 'info', 'Create Emergency Contact', '{"name":"Nabago Fire Sub-Station"}', '2025-12-14 03:39:41.211');
INSERT INTO public.logentry VALUES ('cmj56fh18001tja60j3zg4k3c', 'info', 'Create Emergency Contact', '{"name":"Tagana-an Fire Station"}', '2025-12-14 03:40:04.988');
INSERT INTO public.logentry VALUES ('cmj56fyy0001vja60ykhui0bj', 'info', 'Create Emergency Contact', '{"name":"Tubod Fire Station"}', '2025-12-14 03:40:28.201');
INSERT INTO public.logentry VALUES ('cmj56jepg001yja601zpv1tgm', 'info', 'Create Evacuation Center', '{"name":"San Roque Gymnasium"}', '2025-12-14 03:43:08.597');
INSERT INTO public.logentry VALUES ('cmj56luih0021ja607xspzo2k', 'info', 'Create Evacuation Center', '{"name":"Mat-i Gymnasium"}', '2025-12-14 03:45:02.393');
INSERT INTO public.logentry VALUES ('cmj56nfxk0024ja60j0cfgrfu', 'info', 'Create Evacuation Center', '{"name":"Serna Gymnasium"}', '2025-12-14 03:46:16.808');
INSERT INTO public.logentry VALUES ('cmj56p8yf0027ja601nqsci90', 'info', 'Create Evacuation Center', '{"name":"Poctoy Gymnasium"}', '2025-12-14 03:47:41.08');
INSERT INTO public.logentry VALUES ('cmj56xdkm002cja60wstm62rv', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-14 03:54:00.31');
INSERT INTO public.logentry VALUES ('cmj56xepd002dja6095en99rs', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-14 03:54:01.777');
INSERT INTO public.logentry VALUES ('cmj56xhyq002eja60zj91ccex', 'info', 'Update Incident Report', '{"status":"Published","adminNotes":"Published for guest viewing"}', '2025-12-14 03:54:06.002');
INSERT INTO public.logentry VALUES ('cmj56xj2b002fja60zakk6oz3', 'info', 'Update Incident Report', '{"status":"Published","adminNotes":"Published for guest viewing"}', '2025-12-14 03:54:07.428');
INSERT INTO public.logentry VALUES ('cmj5784f50002jacoygcnig47', 'info', 'Create Official Incident Report: Landslide', '{"type":"Landslide","urgency":"Low","barangayId":"brgy-san-roque","images":1}', '2025-12-14 04:02:21.666');
INSERT INTO public.logentry VALUES ('cmj57fztv0005jacodw7efhx7', 'info', 'Delete User', NULL, '2025-12-14 04:08:28.964');
INSERT INTO public.logentry VALUES ('cmj57g3740006jaco6899k4lm', 'info', 'Delete User', NULL, '2025-12-14 04:08:33.328');
INSERT INTO public.logentry VALUES ('cmj57g66y0007jaco4afp8vo7', 'info', 'Delete User', NULL, '2025-12-14 04:08:37.21');
INSERT INTO public.logentry VALUES ('cmj57gcbl0008jacoiycvwza1', 'info', 'Delete User', NULL, '2025-12-14 04:08:45.154');
INSERT INTO public.logentry VALUES ('cmj57gfeg0009jacoct04n75v', 'info', 'Delete User', NULL, '2025-12-14 04:08:49.145');
INSERT INTO public.logentry VALUES ('cmj57gnd6000ajacobbpgidu2', 'info', 'Delete User', NULL, '2025-12-14 04:08:59.467');
INSERT INTO public.logentry VALUES ('cmj57hefy000cjaco9s2hro18', 'info', 'Create User', '{"username":"sanroque","role":"barangay","barangayId":"brgy-san-roque"}', '2025-12-14 04:09:34.558');
INSERT INTO public.logentry VALUES ('cmj57ieg7000ejacocp4o54sk', 'info', 'Create User', '{"username":"serna","role":"barangay","barangayId":"brgy-serna"}', '2025-12-14 04:10:21.224');
INSERT INTO public.logentry VALUES ('cmj70j5pm0002jahwch2smn9t', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-15 10:30:31.594');
INSERT INTO public.logentry VALUES ('cmj70nt6j0007jahwlm7aempq', 'info', 'Create Evac Center', '{"name":"KRIS VALLOZO HOUSE"}', '2025-12-15 10:34:08.636');
INSERT INTO public.logentry VALUES ('cmj71aatd0008jahwda6ibpcs', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-15 10:51:37.919');
INSERT INTO public.logentry VALUES ('cmj71n4t0000bjahw8y2zg1qa', 'info', 'Create Official Incident Report: Fire', '{"type":"Fire","urgency":"Medium","barangayId":"brgy-mat-i","images":0}', '2025-12-15 11:01:36.66');
INSERT INTO public.logentry VALUES ('cmj722t0m000ejahw1uhrd7jj', 'info', 'Create Evacuation Center', '{"name":"patagan mansion"}', '2025-12-15 11:13:47.878');
INSERT INTO public.logentry VALUES ('cmj729dz6000gjahwsdffv6cz', 'info', 'Create Emergency Alert', '{"title":"yolanda"}', '2025-12-15 11:18:54.978');
INSERT INTO public.logentry VALUES ('cmj72m3tt0002jaq4m5lwa29r', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-15 11:28:48.354');
INSERT INTO public.logentry VALUES ('cmj72m57o0003jaq4twihfj18', 'info', 'Update Incident Report', '{"status":"Published","adminNotes":"Published for guest viewing"}', '2025-12-15 11:28:50.148');
INSERT INTO public.logentry VALUES ('cmj9tb8b90000jadkhxklpc35', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-17 09:31:42.933');
INSERT INTO public.logentry VALUES ('cmj9ttn670001jadk6g17qide', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-17 09:46:01.997');
INSERT INTO public.logentry VALUES ('cmjb04rbw0002jafoiphwfbww', 'info', 'Create Official Incident Report: Landslide', '{"type":"Landslide","urgency":"Low","barangayId":"brgy-san-roque","images":0}', '2025-12-18 05:30:24.476');
INSERT INTO public.logentry VALUES ('cmjb05j540003jafoerc8z4mm', 'info', 'Update Incident Report', '{"status":"Verified","adminNotes":"Verified by admin"}', '2025-12-18 05:31:00.52');
INSERT INTO public.logentry VALUES ('cml9a7aq90001jarcc48ecokf', 'info', 'Create User', '{"username":"mati@example.com","role":"barangay","barangayId":"brgy-mat-i"}', '2026-02-05 09:56:11.409');


--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.message VALUES ('cmirhumz80000jadw1exq2ujb', 'conv-brgy-mat-i', 'Barangay Official', 'sjhshsh', '2025-12-04 13:51:01.724', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmiri2cud0001jadw26s1t0so', 'conv-brgy-mat-i', 'Barangay Official', 'ngekkkk
', '2025-12-04 13:57:00.823', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmizgfa6v0000japkuw72nnvs', 'conv-1765337589080-brgy-balibayon', 'System Admin', 'tae
', '2025-12-10 03:33:15.221', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmizgfub00001japk53jebm1g', 'conv-1765337610731-brgy-mat-i', 'System Admin', 'gAGO

', '2025-12-10 03:33:41.289', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmizggder0002japk8kpzk5ud', 'conv-1765337610731-brgy-mat-i', 'Barangay brgy-mat-i', 'DI WOWW
', '2025-12-10 03:34:06.051', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmizgrc0h0003japklsaihg84', 'conv-1765338151465-brgy-mat-i', 'ADMINISTRATOR', 'huhh?
', '2025-12-10 03:42:37.338', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmizgs68a0004japk1927rxz0', 'conv-1765338151465-brgy-mat-i', 'Brgy-Mat-I Barangay Official', 'fff', '2025-12-10 03:43:16.618', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4blkws0000ja94lbo9zwg9', 'conv-1765631801570-brgy-mat-i', 'ADMINISTRATOR', 'huh?
', '2025-12-13 13:17:01.784', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4cgo9v0001ja94knajtqi2', 'conv-1765633072916-brgy-mat-i', 'admin@example.com', 'huhhh', '2025-12-13 13:41:12.51', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4dtddr0002ja94zexgutfc', 'conv-1765635524761-brgy-mat-i', 'mati', 'saba raw admin
', '2025-12-13 14:19:04.542', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4dtzfo0003ja94m6vo180x', 'conv-1765635524761-brgy-mat-i', 'admin@example.com', 'pakyo kaw', '2025-12-13 14:19:33.156', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4e94no0004ja94itibldzh', 'conv-1765636272774-brgy-mat-i', 'Administrator', 'suss
', '2025-12-13 14:31:19.715', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4ei7eo0005ja94g5vx0hih', 'conv-1765636696757-brgy-mat-i', 'Administrator', 'huh?', '2025-12-13 14:38:23.222', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4erntf0000ja3spmd1lbkf', 'conv-1765637138289-brgy-mat-i', 'Administrator', 'ngek
', '2025-12-13 14:45:44.404', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4ezivg0000jaskktiq1vrq', 'conv-1765637502022-brgy-mat-i', 'Administrator', 'j', '2025-12-13 14:51:51.225', NULL, false, NULL, NULL, 'all', 'Administrator', 'admin', '', 'message');
INSERT INTO public.message VALUES ('cmj4fcltg0000jatoau8rki23', 'conv-1765637889138-brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'admin?
', '2025-12-13 15:02:01.579', 'brgy-mat-i', false, NULL, NULL, 'all', 'Brgy. Mat-i Barangay Official', 'barangay', '', 'message');
INSERT INTO public.message VALUES ('cmj4fdjm20001jato25zpugrm', 'conv-1765637889138-brgy-mat-i', 'Administrator', 'uno mN?
', '2025-12-13 15:02:45.342', NULL, false, NULL, NULL, 'all', 'Administrator', 'admin', '', 'message');
INSERT INTO public.message VALUES ('cmj4g3dv20000jajg17mrobbf', 'conv-1765639086331-brgy-mat-i', 'Administrator', 'amo?
', '2025-12-13 15:22:50.741', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4g3v9p0001jajgju5awyb5', 'conv-1765639086331-brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'yes?', '2025-12-13 15:23:13.532', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4gs6j60002jajgzqcjxc4i', 'conv-1765640515585-brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'hh', '2025-12-13 15:42:06.685', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4gs7wp0003jajgjym9kl9b', 'conv-1765640515585-brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'hh', '2025-12-13 15:42:08.454', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4gsgrl0004jajghq4cfek2', 'conv-1765640515585-brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'hh', '2025-12-13 15:42:21.153', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4gsh300005jajgklhhxm12', 'conv-1765640515585-brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'hh', '2025-12-13 15:42:21.564', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4gsjj30006jajgzm1qamb6', 'conv-1765640515585-brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'hh', '2025-12-13 15:42:22.103', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4gsjkv0007jajg3oxn3344', 'conv-1765640515585-brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'hh', '2025-12-13 15:42:22.299', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4gsrap0008jajguc10386s', 'conv-1765640545357-brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'l', '2025-12-13 15:42:34.801', NULL, false, NULL, NULL, 'all', 'System', 'admin', '', 'general');
INSERT INTO public.message VALUES ('cmj4hgakm0000ja2s098u6yez', 'conv-brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'ijakkk
', '2025-12-13 16:00:52.864', 'brgy-mat-i', false, NULL, NULL, 'all', 'Brgy. Mat-i Barangay Official', 'barangay', '', 'message');
INSERT INTO public.message VALUES ('cmj4hw7410000janswpogn7az', 'conv-1765642384721-brgy-mat-i', 'Brgy. Danao Barangay Official', 'hoy mat i kayaot nimo
', '2025-12-13 16:13:14.879', 'brgy-danao', false, NULL, NULL, 'all', 'Brgy. Danao Barangay Official', 'barangay', '', 'message');
INSERT INTO public.message VALUES ('cmj4hx6lm0001jansnn5mp09p', 'conv-1765642428751-brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'mas yaot rakanw', '2025-12-13 16:14:00.628', 'brgy-mat-i', false, NULL, NULL, 'all', 'Brgy. Mat-i Barangay Official', 'barangay', '', 'message');
INSERT INTO public.message VALUES ('cmj4hx7000002jansw07coiwa', 'conv-1765642428751-brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'mas yaot rakanw', '2025-12-13 16:14:01.165', 'brgy-mat-i', false, NULL, NULL, 'all', 'Brgy. Mat-i Barangay Official', 'barangay', '', 'message');
INSERT INTO public.message VALUES ('cmj4i55ji0003jansoz9nk8ak', 'conv-1765642752305-brgy-danao', 'Brgy. Danao Barangay Official', 'huh', '2025-12-13 16:20:12.742', 'brgy-danao', false, NULL, NULL, 'all', 'Brgy. Danao Barangay Official', 'barangay', '', 'message');
INSERT INTO public.message VALUES ('cmj4j1a4k0004jans28m3896n', 'conv-1765644302330-brgy-danao--brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'yes?
', '2025-12-13 16:45:11.623', 'brgy-mat-i', false, NULL, NULL, 'all', 'Brgy. Mat-i Barangay Official', 'barangay', '', 'message');
INSERT INTO public.message VALUES ('cmj4j2dra0005jansbexkawyx', 'conv-1765644302330-brgy-danao--brgy-mat-i', 'Brgy. Danao Barangay Official', 'susss', '2025-12-13 16:46:02.898', 'brgy-danao', false, NULL, NULL, 'all', 'Brgy. Danao Barangay Official', 'barangay', '', 'message');
INSERT INTO public.message VALUES ('cmj4j2k5r0006janstqk8yb6c', 'conv-1765644302330-brgy-danao--brgy-mat-i', 'Brgy. Danao Barangay Official', 'su', '2025-12-13 16:46:11.343', 'brgy-danao', false, NULL, NULL, 'all', 'Brgy. Danao Barangay Official', 'barangay', '', 'message');
INSERT INTO public.message VALUES ('cmj4j2ouc0007jans306fy6my', 'conv-1765644302330-brgy-danao--brgy-mat-i', 'Brgy. Danao Barangay Official', 'su', '2025-12-13 16:46:17.413', 'brgy-danao', false, NULL, NULL, 'all', 'Brgy. Danao Barangay Official', 'barangay', '', 'message');
INSERT INTO public.message VALUES ('cmj4j9y330008jansr4fmhdxx', 'conv-1765644302330-brgy-danao--brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'what', '2025-12-13 16:51:55.983', 'brgy-mat-i', false, NULL, NULL, 'all', 'Brgy. Mat-i Barangay Official', 'barangay', 'what', 'message');
INSERT INTO public.message VALUES ('cmj57d4xj0003jaco0j825k62', 'conv-brgy-mat-i', 'Administrator', 'Boss pila pa ang vacant diha sa ijo evacuation', '2025-12-14 04:06:15.589', NULL, false, NULL, NULL, 'all', 'Administrator', 'admin', '', 'message');
INSERT INTO public.message VALUES ('cmj57e3ua0004jaco2i73feu5', 'conv-brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'Naay pay 50 + maigo boss, pwede ra dire', '2025-12-14 04:07:00.834', 'brgy-mat-i', false, NULL, NULL, 'all', 'Brgy. Mat-i Barangay Official', 'barangay', '', 'message');
INSERT INTO public.message VALUES ('cmj70kr3u0003jahwmgtm8rl7', 'conv-brgy-mat-i', 'Administrator', 'mat i baho kaw ate', '2025-12-15 10:31:45.976', NULL, false, NULL, NULL, 'all', 'Administrator', 'admin', '', 'message');
INSERT INTO public.message VALUES ('cmj70lnav0004jahw5z13p6qg', 'conv-brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'okY', '2025-12-15 10:32:27.687', 'brgy-mat-i', false, NULL, NULL, 'all', 'Brgy. Mat-i Barangay Official', 'barangay', '', 'message');
INSERT INTO public.message VALUES ('cmj72p7570004jaq4ozzhm05y', 'conv-brgy-mat-i', 'Administrator', 'naay nasunog diha sa brazil', '2025-12-15 11:31:12.591', NULL, false, NULL, NULL, 'all', 'Administrator', 'admin', '', 'message');
INSERT INTO public.message VALUES ('cmj72pwcd0005jaq4ezjdqb9o', 'conv-brgy-mat-i', 'Brgy. Mat-i Barangay Official', 'okayy', '2025-12-15 11:31:45.266', 'brgy-mat-i', false, NULL, NULL, 'all', 'Brgy. Mat-i Barangay Official', 'barangay', '', 'message');
INSERT INTO public.message VALUES ('cmj8jivmu0006jaq4wo0tjma8', 'conv-1765886982115-brgy-mat-i--brgy-serna', 'Brgy. Mat-i Barangay Official', 'hello brgy serna
', '2025-12-16 12:09:57.4', 'brgy-mat-i', false, NULL, NULL, 'all', 'Brgy. Mat-i Barangay Official', 'barangay', '', 'message');


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.news VALUES ('cmj54ad8e0009ja6wb30a01i0', 'Weather update as of 6:25 AM (September 22, 2025) | Unang Balita', 'Unang Balita is the news segment of GMA Network''s daily morning program, Unang Hirit. It''s anchored by Arnold Clavio, Susan Enriquez, Ivan Mayrina, and Mariz Umali, and airs on GMA-7 Mondays to Fridays at 5:30 AM (PHL Time). For more videos from Unang Balita, visit http://www.gmanetwork.com/unangbalita.

#GMAIntegratedNews #GMANetwork #KapusoStream

Breaking news and stories from the Philippines and abroad:
GMA Integrated News Portal: http://www.gmanews.tv
Facebook:   / gmanews  
TikTok:   / gmanews  
Twitter:   / gmanews  
Instagram:   / gmanews  

GMA Network Kapuso programs on GMA Pinoy TV: https://gmapinoytv.com/subscribe
How this was made', '["Advisory","Preparedness","Event","Safety Tips","Updates"]', 'YouTube', 'https://youtu.be/sIJJl6mDv04?si=AhBQIHJyVg2SNYSb', '', '2025-12-14 02:40:07.544', 'GMA Integrated News', 'GMA Integrated News');
INSERT INTO public.news VALUES ('cmj54cywj000bja6wnlierzai', 'Stronger ''amihan'' surge expected; shear line to bring rains as PAGASA rules out cyclone in the comin', 'A stronger surge of the northeast monsoon, or ΓÇ£amihan,ΓÇ¥ is expected to affect parts of the country in the coming days, the Philippine Atmospheric, Geophysical and Astronomical Services Administration (PAGASA) said on Saturday, December 12, while ruling out the presence of any tropical cyclone within the Philippine Area of Responsibility (PAR) in the coming days.

READ: https://mb.com.ph/2025/12/13/stronger...

Subscribe to the Manila Bulletin Online channel!     / themanilabulletin  

Visit our website at http://mb.com.ph
Facebook:   / manilabulletin  
Twitter:   / manila_bulletin  
Instagram:   / manilabulletin  
Tiktok: https://www.tiktok.com @manilabulletin

#ManilaBulletinOnline
#ManilaBulletin
#LatestNews

Manila', '["Advisory","Preparedness","Event","Safety Tips","Updates"]', 'YouTube', 'https://youtu.be/SmBjFe9_AJA?si=GqhQnoAtHBuoQsHW', '', '2025-12-14 02:42:08.795', 'Manila Bulletin', 'Manila Bulletin');
INSERT INTO public.news VALUES ('cmj54erm6000dja6wioosfkrq', 'Bagyong Wilma, posibleng tawirin ang Visayas ngayong gabi | 24 Oras Weekend', 'Mga Kapuso, simula ngayong gabi, posibleng tawirin ng Bagyong Wilma ang bahagi ng Visayas.


24 Oras Weekend is GMA NetworkΓÇÖs flagship newscast, anchored by Ivan Mayrina and Pia Arcangel. It airs on GMA-7, Saturdays and Sundays at 5:30 PM (PHL Time). For more videos from 24 Oras Weekend, visit http://www.gmanews.tv/24orasweekend.

#GMAIntegratedNews #KapusoStream

Breaking news and stories from the Philippines and abroad:
GMA Integrated News Portal: http://www.gmanews.tv
Facebook:   / gmanews  
TikTok:   / gmanews  
Twitter:   / gmanews  
Instagram:   / gmanews  

GMA Network Kapuso programs on GMA Pinoy TV: https://gmapinoytv.com/subscribe', '["Preparedness","Advisory","Event","Safety Tips","Updates"]', 'YouTube', 'https://youtu.be/v72x2CrHm2g?si=9ElcfucdoDWj9NVV', '', '2025-12-14 02:43:32.173', 'GMA Integrated News', 'GMA Integrated News');
INSERT INTO public.news VALUES ('cmj54g8t8000fja6wh2qkskmr', 'Weather update as of 6AM (October 17, 2025) | Unang Balita', 'Unang Balita is the news segment of GMA Network''s daily morning program, Unang Hirit. It''s anchored by Arnold Clavio, Susan Enriquez, Ivan Mayrina, and Mariz Umali, and airs on GMA-7 Mondays to Fridays at 5:30 AM (PHL Time). For more videos from Unang Balita, visit http://www.gmanetwork.com/unangbalita.

#GMAIntegratedNews #GMANetwork #KapusoStream

Breaking news and stories from the Philippines and abroad:
GMA Integrated News Portal: http://www.gmanews.tv
Facebook:   / gmanews  
TikTok:   / gmanews  
Twitter:   / gmanews  
Instagram:   / gmanews  

GMA Network Kapuso programs on GMA Pinoy TV: https://gmapinoytv.com/subscribe', '["Event","Preparedness","Advisory","Updates","Safety Tips"]', 'YouTube', 'https://youtu.be/bwbCnn9Ah2o?si=PiVrbXuzA37xK8Jr', '', '2025-12-14 02:44:41.75', 'GMA Integrated News', 'GMA Integrated News');
INSERT INTO public.news VALUES ('cmj54hgt0000hja6wtr45nf6j', 'Bagyong Ramil, posibleng tumama at tumawid sa lupa ngayong weekend | 24 Oras', '24 Oras is GMA NetworkΓÇÖs flagship newscast, anchored by Mel Tiangco, Vicky Morales and Emil Sumangil. It airs on GMA-7 Mondays to Fridays at 6:30 PM (PHL Time) and on weekends at 5:30 PM. For more videos from 24 Oras, visit http://www.gmanews.tv/24oras.


#GMAIntegratedNews #GMANetwork #KapusoStream

Breaking news and stories from the Philippines and abroad:
GMA Integrated News Portal: http://www.gmanews.tv
Facebook:   / gmanews  
TikTok:   / gmanews  
Twitter:   / gmanews  
Instagram:   / gmanews  

GMA Network Kapuso programs on GMA Pinoy TV: https://gmapinoytv.com/subscribe', '["Advisory","Preparedness","Event","Safety Tips","Updates"]', 'YouTube', 'https://youtu.be/IPtl4AbNOCY?si=89p21PkS1HPKNG3d', '', '2025-12-14 02:45:38.763', 'GMA Integrated News', 'GMA Integrated News');
INSERT INTO public.news VALUES ('cmj54rpko000nja6wn1nr3nlf', 'Sunog, sumiklab sa residential area 13 araw bago mag-Pasko | Saksi', 'Halos dalawang linggo bago Magpasko, sumiklab ang sunog sa residential area sa Barangay Pleasant Hills, Mandaluyong City. Mahina ang tubig sa hydrant malapit sa nasusunog na lugar kaya tumulong na ang mga residente para maapula ang sunog.


Saksi is GMA Network''s late-night newscast hosted by Pia Arcangel. It airs Mondays to Fridays at 10:20 PM (PHL Time) on GMA-7. For more videos from Saksi, visit http://www.gmanews.tv/saksi. .

#GMAIntegratedNews #KapusoStream

Breaking news and stories from the Philippines and abroad:
GMA Integrated News Portal: http://www.gmanews.tv
Facebook:   / gmanews  
TikTok:   / gmanews  
Twitter:   / gmanews  
Instagram:   / gmanews  

GMA Network Kapuso programs on GMA Pinoy TV: https://gmapinoytv.com/subscribe', '["Advisory","Preparedness","Event","Safety Tips","Updates"]', 'YouTube', 'https://youtu.be/xOn553KXUjY?si=IQJDd4wlWyw7cw1Z', '', '2025-12-14 02:53:36.633', 'GMA Integrated News', 'GMA Integrated News');
INSERT INTO public.news VALUES ('cmj54t7xf000pja6wainwyyx6', '3 injured in huge Happyland fire | 24 Oras Weekend', 'A huge conflagration engulfed houses at the Happyland residential area in Tondo, Manila, resulting in three injuries and around P1.5 million in property damage. EJ Gomez reports.


24 Oras Weekend is GMA NetworkΓÇÖs flagship newscast, anchored by Ivan Mayrina and Pia Arcangel. It airs on GMA-7, Saturdays and Sundays at 5:30 PM (PHL Time). For more videos from 24 Oras Weekend, visit http://www.gmanews.tv/24orasweekend.

#GMAIntegratedNews #KapusoStream

Breaking news and stories from the Philippines and abroad:
GMA Integrated News Portal: http://www.gmanews.tv
Facebook:   / gmanews  
TikTok:   / gmanews  
Twitter:   / gmanews  
Instagram:   / gmanews  

GMA Network Kapuso programs on GMA Pinoy TV: https://gmapinoytv.com/subscribe', '["Advisory","Preparedness","Event","Safety Tips","Updates"]', 'YouTube', 'https://youtu.be/hiSaF_f3Z_M?si=fxjnsL5fPaNQc9OF', '', '2025-12-14 02:54:47.105', 'GMA Integrated News', 'GMA Integrated News');
INSERT INTO public.news VALUES ('cmj54vl8r000rja6wduobz4l2', 'APEKTADO SA SUNOG SA SURIGAO CITY, MISAKA SA 139', 'APEKTADO SA SUNOG SA SURIGAO CITY, MISAKA SA 139', '["Preparedness","Advisory","Event","Safety Tips","Updates"]', 'YouTube', 'https://youtu.be/JtLIEBsHb-k?si=PSL6vZCyNXPlMtkL', '', '2025-12-14 02:56:36.221', 'XFM 107.1 TAGUM CITY ', 'XFM 107.1 TAGUM CITY ');


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."user" VALUES ('cml98hn5y0000jaf0l732xjcv', 'admin@example.com', 'password123', 'admin', NULL, '2026-02-05 09:08:14.855', 'admin@example.com');
INSERT INTO public."user" VALUES ('cml98hn630001jaf00r67ws7j', 'barangay@example.com', 'password123', 'barangay', 'brgy-serna', '2026-02-05 09:08:14.859', 'barangay@example.com');
INSERT INTO public."user" VALUES ('cml98hn650002jaf08s2wu1jn', 'guest@example.com', 'password123', 'guest', NULL, '2026-02-05 09:08:14.862', 'guest@example.com');
INSERT INTO public."user" VALUES ('cml9a7aom0000jarcavooc07k', 'mati@example.com', '123456', 'barangay', 'brgy-mat-i', '2026-02-05 09:56:11.343', 'mati@example.com');


--
-- PostgreSQL database dump complete
--

\unrestrict E55r7G9e0rdNm5aX3jIT5VjAeI17F8dDx7m8NhyvDh8mSzOrGky3h1qOroi7DAh

