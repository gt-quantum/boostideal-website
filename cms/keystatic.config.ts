import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'gt-quantum/boostideal-website',
  },
  ui: {
    brand: { name: 'BoostIdeal' },
  },
  collections: {
    blog: collection({
      label: 'Blog posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'publishDate'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { length: { min: 1 } },
          },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
          validation: { length: { min: 1 } },
        }),
        publishDate: fields.date({
          label: 'Publish date',
          defaultValue: { kind: 'today' },
        }),
        updatedDate: fields.date({
          label: 'Last updated',
          description: 'Optional. Surfaces an "Updated on" line on the post.',
        }),
        author: fields.text({
          label: 'Author',
          defaultValue: 'BoostIdeal',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        ogImage: fields.image({
          label: 'Social image',
          description: 'Optional. 1200x630 recommended.',
          directory: 'public/og',
          publicPath: '/og/',
        }),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'When checked, the post is not published on the live site.',
          defaultValue: false,
        }),
        content: fields.markdoc({
          label: 'Content',
        }),
      },
    }),

    offers: collection({
      label: 'Offers',
      slugField: 'title',
      path: 'src/content/offers/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { length: { min: 1 } },
          },
        }),
        description: fields.text({
          label: 'Meta description',
          multiline: true,
        }),
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            headline: fields.text({
              label: 'Headline',
              validation: { length: { min: 1 } },
            }),
            sub: fields.text({ label: 'Subhead', multiline: true }),
            ctaLabel: fields.text({
              label: 'CTA label',
              defaultValue: 'Get started',
            }),
          },
          { label: 'Hero' },
        ),
        ogImage: fields.image({
          label: 'Social image',
          directory: 'public/og',
          publicPath: '/og/',
        }),
        draft: fields.checkbox({
          label: 'Draft',
          defaultValue: false,
        }),
        content: fields.markdoc({
          label: 'Body content',
        }),
      },
    }),
  },
});
