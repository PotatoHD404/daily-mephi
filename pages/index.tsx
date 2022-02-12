import styles from '../styles/Home.module.css'
import {useSession, signIn, signOut} from "next-auth/react"
import React, {Component, useEffect} from "react";
import db from '../lib/firebase/db'
import {initializeApp} from "firebase/app";
import {
    connectFirestoreEmulator,
    doc,
    getDoc,
    initializeFirestore,
    setLogLevel,
    collection as col,
    addDoc
} from "firebase/firestore";
import {Tutor} from "../lib/backend/models";
import PropTypes from "prop-types";
import withSession from "../components/withSession";
import {Session} from "next-auth";
import SEO from "../components/seo";
import Image from 'next/image'
import template from '../images/template.jpg'
import Navbar from '../components/navbar'
import Link from 'next/link'


//https://next-auth.js.org/configuration/options

class Home extends Component<{ session: Session }> {

    constructor(props: any) {
        super(props);
    }


    async componentDidMount() {

        let data: Tutor = {
            id: 'string',
            name: 'string',
            old_rating: {
                character: -5,
                count: 1000,
                exams: -5,
                quality: 5
            },
            description: 'string',
            image: 'string',
            url: 'string',
            since: new Date(),
            updated: new Date(),
            disciplines: [],
            faculties: []
        };

        // console.log(db);
        // await enableIndexedDbPersistence(db);

        // console.log('1');
        // await addDoc(col(db, 'tutors'), data);
    }


    render() {
        return (
            <div>
                <SEO title={'Главная'} description={'what?'}/>
                <div className={styles.bgWrap}><Image
                    src={template}
                    alt="Picture of the author"
                    width={1920}
                    height={1080}
                    quality={100}
                    objectFit="cover"
                /></div>
                <Navbar/>
                {/*<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad autem, consequatur distinctio eos eum*/}
                {/*    exercitationem fuga illo inventore iusto labore laboriosam molestias nobis nulla perferendis*/}
                {/*    perspiciatis possimus quasi quia quisquam saepe sint! Beatae neque officiis soluta. Assumenda*/}
                {/*    corporis earum expedita explicabo facilis impedit inventore, itaque iure iusto nobis non nulla*/}
                {/*    numquam odio officiis, omnis provident quibusdam recusandae, sapiente similique suscipit tempora*/}
                {/*    totam vitae. Accusantium ad error iure nemo nisi praesentium totam. At blanditiis corporis ducimus*/}
                {/*    esse incidunt inventore ipsum iusto minima necessitatibus possimus, quisquam reiciendis similique*/}
                {/*    tempore ullam veritatis! Accusamus adipisci assumenda atque deleniti deserunt libero molestiae*/}
                {/*    nostrum quam. Aliquid aut commodi consequuntur dolore dolorem ea excepturi expedita explicabo harum*/}
                {/*    id impedit libero molestiae natus nemo nisi, nobis officia quam recusandae rerum saepe similique*/}
                {/*    suscipit voluptatibus. Alias aliquid culpa eligendi est neque obcaecati officiis quasi quia*/}
                {/*    sapiente, sint veritatis voluptas. Ad adipisci debitis deleniti eligendi illum, iure magni*/}
                {/*    perspiciatis sit soluta tempora? Iusto laborum numquam pariatur quidem repudiandae sed? Accusantium*/}
                {/*    ducimus ipsum nulla quisquam veritatis! Ad at autem dolor doloribus explicabo necessitatibus optio*/}
                {/*    quam repudiandae tenetur vitae. Animi, at consequuntur culpa cumque dolorum ex laudantium non,*/}
                {/*    perferendis possimus quasi recusandae sapiente sit tenetur, voluptas voluptatibus? Aspernatur*/}
                {/*    debitis earum ex exercitationem facilis, fugit maxime minima porro quaerat, quod repellendus velit*/}
                {/*    voluptas. Aperiam beatae deleniti fuga harum, iusto odio quia quo sit? At cumque deserunt hic*/}
                {/*    incidunt laudantium molestiae odio perspiciatis reiciendis tempora voluptatibus. Ad architecto*/}
                {/*    asperiores aut beatae distinctio doloribus et excepturi expedita, explicabo facere illum in iure*/}
                {/*    libero minus nostrum obcaecati odio odit officiis perferendis quia quisquam repellendus repudiandae*/}
                {/*    sequi similique totam vitae voluptatem voluptatum. Animi atque, consectetur dicta eaque enim*/}
                {/*    inventore iure quis velit vero! Corporis deleniti eaque eligendi eveniet ipsam itaque, labore, modi*/}
                {/*    nam, quam qui quia repudiandae tenetur vitae? Consequuntur, ducimus ea eos facere facilis maxime*/}
                {/*    molestias perferendis rem tenetur unde veritatis voluptatem. Aliquam, eius placeat. Explicabo fuga*/}
                {/*    illum labore nobis repellendus. Accusamus animi cupiditate, debitis ducimus, eaque eius illum in*/}
                {/*    minus necessitatibus odio quas reiciendis ullam vero? Accusamus, alias assumenda cumque distinctio*/}
                {/*    ex facere impedit modi officia reiciendis veritatis. Ad, aliquid commodi cum deleniti dignissimos*/}
                {/*    eaque est ex facere iusto laborum maxime modi natus neque nisi nobis nostrum odio omnis optio*/}
                {/*    pariatur porro praesentium quas quasi quidem quod repellat, sint soluta sunt totam vel voluptatem.*/}
                {/*    Beatae dolor eveniet ex itaque molestias nihil quaerat? Consequatur error et id odit quisquam ut!*/}
                {/*    Blanditiis eum explicabo non praesentium ratione recusandae soluta velit veritatis voluptatem*/}
                {/*    voluptatibus! Accusantium adipisci blanditiis commodi consequuntur delectus doloremque doloribus*/}
                {/*    enim, harum inventore magnam maiores nostrum odit quidem sapiente temporibus velit voluptate. Ex*/}
                {/*    nostrum, placeat. Aliquam amet assumenda at autem consequatur, cumque doloribus ea exercitationem*/}
                {/*    hic illum ipsa nulla, odit optio provident quibusdam reiciendis saepe sed, suscipit? A, asperiores*/}
                {/*    autem cupiditate eligendi eveniet exercitationem fugit iste minus nisi obcaecati officia perferendis*/}
                {/*    quaerat quasi quia quo reprehenderit totam vel voluptatem! Accusamus aliquam animi architecto aut*/}
                {/*    blanditiis deserunt ea eaque expedita illum iure maxime minima mollitia nam natus non numquam odit*/}
                {/*    perferendis quibusdam quisquam, quos suscipit tenetur voluptas voluptatum? Cum dolores esse harum*/}
                {/*    ipsum nostrum? A alias amet animi, assumenda beatae delectus deleniti deserunt doloremque eaque*/}
                {/*    explicabo facere, hic iure laboriosam maxime minima, modi neque nulla odio officiis quia rem*/}
                {/*    reprehenderit sapiente similique tempora temporibus ullam unde! A accusantium architecto aspernatur*/}
                {/*    consequuntur corporis debitis ea est ipsa nemo nostrum, odit quam quisquam, reiciendis sapiente*/}
                {/*    sequi sit suscipit tempora veritatis! At beatae doloremque facilis id laudantium nemo nihil*/}
                {/*    perferendis qui rerum, veniam. Culpa delectus distinctio doloremque doloribus dolorum enim incidunt*/}
                {/*    iusto labore libero necessitatibus numquam obcaecati odit qui soluta tempora, temporibus vitae!*/}
                {/*    Alias asperiores autem, commodi cumque eligendi fugit maxime neque officiis quis quo repudiandae*/}
                {/*    rerum sequi vero? Ab asperiores consectetur illum officia omnis quidem reiciendis reprehenderit sunt*/}
                {/*    veritatis voluptatibus. Assumenda dicta fugit, iure omnis placeat repellendus reprehenderit sint!*/}
                {/*    Et, harum, id. Aspernatur atque dolore eligendi impedit, iusto mollitia sed. Asperiores aspernatur*/}
                {/*    commodi consequatur corporis deleniti dolor, eius eos fugiat incidunt, ipsam modi molestiae nisi*/}
                {/*    nobis officia omnis quas quibusdam rerum sunt tempore, temporibus? A atque beatae eos eum eveniet*/}
                {/*    exercitationem fugit illo illum, ipsam laboriosam maiores mollitia optio porro, rem, repellendus*/}
                {/*    sunt voluptate? Adipisci ea exercitationem illo laboriosam magnam nihil nobis nulla sapiente? Cum*/}
                {/*    dolorem dolores doloribus earum, eius facere impedit incidunt laborum molestias, nam natus*/}
                {/*    necessitatibus nostrum numquam sed sit vel voluptatem. Deserunt in minus obcaecati quibusdam*/}
                {/*    tenetur! Accusantium adipisci amet dicta, eius expedita incidunt inventore magni modi perspiciatis*/}
                {/*    quia quidem repellendus soluta, veniam! Ad atque cumque dolor error facilis harum, hic illo illum*/}
                {/*    laudantium minima, molestias nam optio pariatur quod soluta ut veritatis? Adipisci animi aperiam*/}
                {/*    architecto beatae consequuntur debitis deserunt ducimus eius enim eos, exercitationem fugit harum*/}
                {/*    ipsam libero maxime minima nam nemo nisi omnis quae quidem quis quisquam rem repellat saepe sequi*/}
                {/*    sunt! Assumenda cumque dolores doloribus, excepturi id itaque iusto magni modi similique veniam.*/}
                {/*    Amet at beatae dolores ducimus eaque error magnam nesciunt nihil odio, perspiciatis repellat saepe*/}
                {/*    tempora? Accusamus blanditiis dolorem doloribus laudantium neque. Adipisci aliquid, aperiam culpa*/}
                {/*    eligendi error exercitationem explicabo impedit ipsa iste iusto laboriosam libero natus*/}
                {/*    necessitatibus quia repellat ullam, voluptas voluptate voluptates! Accusamus alias, aut cupiditate*/}
                {/*    dolore et, eum hic incidunt ipsa numquam quibusdam, reiciendis reprehenderit temporibus voluptate.*/}
                {/*    Accusantium amet asperiores aspernatur aut blanditiis consequatur consequuntur cumque deserunt*/}
                {/*    dignissimos dolore dolorem doloremque eligendi enim excepturi explicabo id iure iusto labore*/}
                {/*    laudantium nemo omnis praesentium quaerat quas quidem repudiandae suscipit tempora unde voluptatem*/}
                {/*    voluptates, voluptatibus. Ab asperiores culpa, dolore dolorem facilis inventore iure odit quae*/}
                {/*    quisquam repellendus, repudiandae sint sit tempora tempore totam unde voluptate voluptatem! Ab*/}
                {/*    adipisci cupiditate deleniti ducimus eligendi exercitationem hic nam quasi quod sequi similique*/}
                {/*    sint, ut veritatis? Adipisci assumenda autem cumque cupiditate dolorem ea earum error eveniet fugit*/}
                {/*    in incidunt inventore ipsum, iste iure labore magni molestias necessitatibus neque nesciunt, nihil*/}
                {/*    non obcaecati odit officiis perspiciatis placeat quae quam sit, suscipit totam vero. A ab aliquid*/}
                {/*    autem consequuntur deserunt distinctio ea, fuga ipsam magni minima nisi perspiciatis placeat saepe*/}
                {/*    sequi vero. Dolorem eligendi itaque nostrum, omnis provident recusandae soluta vero voluptas. A ab*/}
                {/*    accusantium asperiores blanditiis ex excepturi expedita explicabo fuga hic, ipsum, libero*/}
                {/*    necessitatibus nostrum optio praesentium quaerat quis quisquam sapiente similique temporibus ullam*/}
                {/*    vel voluptatem voluptates. Aliquam aspernatur maiores molestias nemo quasi veritatis vero*/}
                {/*    voluptatem. Commodi consectetur deserunt dolorum error eveniet facilis, fugit iusto nisi nobis,*/}
                {/*    quisquam quod recusandae sit veniam veritatis voluptates. Doloribus numquam quod temporibus*/}
                {/*    voluptate. Adipisci aliquam animi at corporis deleniti deserunt dolorem eos error esse, eveniet*/}
                {/*    excepturi facere fuga harum impedit iste iusto nobis officiis pariatur placeat praesentium qui quo,*/}
                {/*    recusandae sapiente totam vel veniam voluptate? Aut autem blanditiis culpa dignissimos eligendi eos*/}
                {/*    ex expedita id laudantium libero maiores molestias, nihil obcaecati porro, quidem quis repellat*/}
                {/*    repellendus reprehenderit sequi sint sit tempora tenetur veniam vero vitae. Aliquid aspernatur*/}
                {/*    consequuntur culpa, dolore dolorem doloremque, doloribus ducimus earum eius enim esse facilis iste*/}
                {/*    itaque nam qui quisquam ratione, totam! Consequuntur deleniti dolorum eaque ex exercitationem facere*/}
                {/*    illum repudiandae velit veniam! Amet delectus deleniti dolore expedita iure labore, laborum*/}
                {/*    necessitatibus pariatur perferendis praesentium qui quo sed voluptatibus! Corporis magni nobis*/}
                {/*    placeat quas ullam! Ab accusantium culpa dignissimos dolorem eaque enim eos et harum in maiores*/}
                {/*    molestiae molestias mollitia nihil nostrum odit perferendis quam quas quo vero, voluptas. Ad*/}
                {/*    corporis error explicabo hic illo perferendis recusandae, rerum. Atque aut enim error expedita*/}
                {/*    facere iste neque quibusdam quis repellendus, rerum suscipit tenetur voluptatem. Deleniti, nemo,*/}
                {/*    quam? Aliquam deserunt repellat vero? Ea perferendis possimus rerum temporibus unde! Amet architecto*/}
                {/*    autem distinctio dolore earum enim, esse eum, ex expedita fuga hic incidunt laudantium minima*/}
                {/*    molestiae praesentium provident quis recusandae rerum sed sequi sunt tempore tenetur vel. Deserunt,*/}
                {/*    dolorem ea eius exercitationem expedita ipsam iusto laudantium nobis odio quasi, sequi similique*/}
                {/*    veritatis vero! Dolorem et impedit necessitatibus optio. Eius ex maxime modi natus possimus*/}
                {/*    reiciendis velit. Aliquam esse eveniet id placeat quisquam, velit vitae. Laudantium, magni maiores*/}
                {/*    minima obcaecati quia quod reiciendis. Adipisci amet aperiam assumenda aut consequuntur cumque dolor*/}
                {/*    dolores eligendi enim error fugiat id, illo illum ipsum iste itaque labore magni minima molestiae*/}
                {/*    nemo neque nesciunt nihil, porro reiciendis similique suscipit unde velit voluptate voluptates*/}
                {/*    voluptatum. Eveniet illo laboriosam necessitatibus qui soluta suscipit, voluptatum! Animi aut*/}
                {/*    consequuntur cumque ex facilis fuga inventore itaque laudantium minus nemo omnis, placeat provident*/}
                {/*    quasi quis quos ratione temporibus unde velit veritatis voluptatum! Accusantium ad aspernatur at*/}
                {/*    beatae consequatur corporis dicta dolore doloribus ducimus eius explicabo facere libero modi*/}
                {/*    molestias odio officia possimus quam quasi quidem quisquam rem repellendus sapiente tempora,*/}
                {/*    veritatis voluptas. Ab aliquid aperiam commodi earum et fugit impedit ipsa magni omnis temporibus.*/}
                {/*    Atque earum enim excepturi expedita quaerat quis ut vero? Asperiores atque, aut debitis, dolore*/}
                {/*    dolorem dolores esse fugiat hic illo in laudantium modi molestias odit, quo quod reiciendis sequi*/}
                {/*    similique tempore totam voluptates. Expedita nemo, obcaecati? Accusantium aspernatur aut consectetur*/}
                {/*    cum deleniti dicta dolorum facilis illo laboriosam, minus molestias possimus, sed tenetur? Adipisci*/}
                {/*    deleniti id iusto reprehenderit suscipit! Est obcaecati quae, quis repellendus repudiandae tempore!*/}
                {/*    Aliquid blanditiis corporis delectus dolore expedita facere fugiat in nam nisi nulla officiis,*/}
                {/*    pariatur perspiciatis provident reprehenderit sapiente ullam veritatis vitae. Animi eius enim*/}
                {/*    explicabo fuga ipsa itaque mollitia possimus provident soluta! Ab rerum, tenetur. A ab aperiam*/}
                {/*    aspernatur doloribus ducimus, eaque eveniet laborum magnam maiores nulla odio odit pariatur*/}
                {/*    perferendis provident quas rerum voluptate voluptatum. Aperiam doloribus ea error facere facilis id*/}
                {/*    incidunt inventore ipsam, maxime natus nulla officiis optio repellat repellendus, similique*/}
                {/*    suscipit, velit voluptate voluptatem? At, odit, optio! Error illo ipsam ipsum sapiente. Accusamus*/}
                {/*    adipisci amet aspernatur atque aut beatae blanditiis consequatur culpa, cumque deserunt distinctio*/}
                {/*    doloremque dolorum eius fuga harum inventore ipsa ipsam iste iusto labore maxime modi molestiae*/}
                {/*    mollitia natus necessitatibus nisi non, nostrum nulla odio officia officiis quisquam quo quos*/}
                {/*    suscipit temporibus velit voluptas. Accusamus blanditiis dicta dolor iste quod! Beatae cum*/}
                {/*    dignissimos eaque eveniet nobis numquam omnis pariatur sapiente tempore veritatis. Alias amet*/}
                {/*    aspernatur enim numquam quasi! Aliquam at cumque deserunt dicta dignissimos ducimus eligendi eos est*/}
                {/*    harum id in itaque magnam nihil non numquam placeat porro provident, quasi, repudiandae voluptates!*/}
                {/*    Ad amet architecto aspernatur, atque consequuntur eaque est et fugiat impedit incidunt, inventore*/}
                {/*    itaque iure labore laborum magnam magni maiores, molestias necessitatibus nemo nobis non nulla porro*/}
                {/*    possimus quidem quisquam reiciendis saepe sapiente sunt ut velit! Asperiores consectetur ea enim et*/}
                {/*    facere inventore ipsa neque nostrum provident, quam saepe sunt vel. At atque doloribus ducimus*/}
                {/*    eveniet facilis harum pariatur porro provident quidem sit. Amet aspernatur iure labore quas*/}
                {/*    veritatis. Accusantium architecto at atque dicta dignissimos doloribus earum, excepturi facilis*/}
                {/*    fugiat harum labore minus modi nesciunt perspiciatis placeat quibusdam reprehenderit suscipit ullam*/}
                {/*    voluptate voluptatem. Adipisci aliquam amet asperiores aspernatur beatae corporis dolore ducimus*/}
                {/*    earum eligendi error expedita id itaque iure laudantium libero, maxime minima minus molestias*/}
                {/*    nostrum numquam obcaecati officiis pariatur perferendis quas quia quisquam quos sed sint unde vero.*/}
                {/*    Ab adipisci alias aliquam aliquid aut consectetur consequuntur dolores doloribus dolorum eaque earum*/}
                {/*    eius enim, et eum explicabo illo itaque iure laboriosam libero magnam modi nam natus odio odit*/}
                {/*    officia optio quibusdam repellendus repudiandae rerum saepe sapiente totam voluptate voluptatem. Ab*/}
                {/*    corporis debitis facere neque, nulla odio omnis quis, quo ratione, reiciendis repellat velit?*/}
                {/*    Aperiam aut commodi consequatur culpa deserunt dolores ex fugiat illo iste libero natus odit, quos*/}
                {/*    ratione recusandae sequi sint soluta, veritatis voluptatem. Cupiditate dolor doloremque facilis in*/}
                {/*    ipsam nemo nisi quo tempora? A amet aperiam consectetur eveniet facere illum laborum maxime, nemo*/}
                {/*    odio omnis quas, sed soluta vero vitae voluptates. Animi autem, commodi consequuntur cupiditate*/}
                {/*    debitis dolorem earum hic ipsa, iste laudantium necessitatibus nesciunt nobis veritatis, vero*/}
                {/*    voluptatum? Aperiam architecto autem corporis cum deserunt enim eveniet ex hic iure, labore laborum*/}
                {/*    libero modi molestiae odio provident, quo reiciendis rem sint. Amet animi asperiores at commodi*/}
                {/*    culpa doloribus eius facere illo modi nihil praesentium, quo reiciendis repellendus sit unde, vel*/}
                {/*    voluptatum? Cumque deserunt dignissimos ducimus ea eaque eveniet non quia reprehenderit ullam vero.*/}
                {/*    Amet assumenda delectus dolorem eius excepturi iste itaque iusto libero porro! At cumque doloribus*/}
                {/*    dolorum, eos exercitationem fugit id ipsam maiores mollitia neque nobis nostrum obcaecati quibusdam*/}
                {/*    quisquam rem repellat repudiandae sequi, suscipit tempore, vel velit!*/}
                {/*</div>*/}
            </div>
        )
    }
}


export default withSession(Home);


//        if (this.props.session) {
//
//             return (
//                 <>
//                     Signed in as {this.props.session.user?.name ?? 'wha'} <br/>
//                     <button onClick={() => signOut()}>Sign out</button>
//                 </>
//             )
//         }
//         return <>
//             Not signed in <br/>
//             <button onClick={(e) => {
//                 e.preventDefault()
//                 signIn().then(() => {
//                 })
//             }}>Sign in
//             </button>
//         </>;