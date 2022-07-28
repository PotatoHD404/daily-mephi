import BuyMeACoffeeWidget from "../../../components/buyMeCoffee";
import buyMeCoffeeDocs from "./buyMeCoffee.docs.mdx";

export default {
    title: 'BuyMeACoffeeWidget',
    component: BuyMeACoffeeWidget,
    parameters: {
        docs: {
            page: buyMeCoffeeDocs,
        },
    },
}

export const BuyMeACoffeeWidgetComponent = () => <BuyMeACoffeeWidget />
