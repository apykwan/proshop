import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description}/>
            <meta name="keywords" content={keywords} />
        </Helmet>
    )
}

Meta.defaultProps = {
    title: "Welcome to ProShop",
    description: "Take your time, Look around!",
    keywords: "electornics, phones, video games, electric vehicle..."
}

export default Meta;