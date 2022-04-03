export default {
    functional: true,
    props: {
      render: Function,
      scope: Object
    },
    render: (h, ctx) => {
      return ctx.props.render(h, { ...ctx.props.scope })
    }
  }
