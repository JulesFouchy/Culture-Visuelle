import Point from '../components/Point'

enum Category {
    Technical,
    Cultural,
    Memorisation,
    Editorial,
}

interface ArticleDescription {
    title: string,
    authors: string[],
    icon: string,
    iconUnicode: string,
    category: Category,
    folderName: string,
}

interface ArticleDescriptionAndPosition {
    desc: ArticleDescription,
    currentPos: Point,
    initPos: Point
}

export { ArticleDescription, Category , ArticleDescriptionAndPosition}