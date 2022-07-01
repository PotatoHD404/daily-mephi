import {container} from "tsyringe";
import {ApiModule} from "lib/injection/api.module";

// import 'lib/api/comments/comments.controller.ts';
// import 'lib/api/cover/cover.controller.ts';
// import 'lib/api/disciplines/disciplines.controller.ts';
// import 'lib/api/faculties/faculties.controller.ts';
// import 'lib/api/files/files.controller.ts';
// import 'lib/api/materials/materials.controller.ts';
// import 'lib/api/quotes/quotes.controller.ts';
// import 'lib/api/reviews/reviews.controller.ts';
// import 'lib/api/search/search.controller.ts';
// import 'lib/api/top/top.controller.ts';
// import 'lib/api/tutors/tutors.controller.ts';
import 'lib/api/users/users.controller.ts';
// import 'lib/api/migrations/migrations.controller.ts';


export default container.resolve(ApiModule).getHandler();