import Point from '../components/Point'

enum Category {
    Technical,
    Cultural,
    Memorisation,
}

interface ArticleDescription {
    title: string,
    authors: string[],
    icon: string,
    category: Category,
    folderName: string,
}

interface ArticleDescriptionAndPosition {
    desc: ArticleDescription,
    currentPos: Point,
    initPos: Point
}

export { ArticleDescription, Category , ArticleDescriptionAndPosition}