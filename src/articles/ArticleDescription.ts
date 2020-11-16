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

export { ArticleDescription, Category }