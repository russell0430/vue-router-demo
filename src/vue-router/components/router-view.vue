<script>
export default {
  name: "RouterView",
  functional: true, 
  //函数式组件,无状态,...,类似react 纯组件,无this实例
  render(h, ctx) {
    // 标记当前dataView为true
    ctx.data.dataView = true;
    let { parent, data } = ctx; 
    const route=parent.$route;
    // 表示当前RouterView需要渲染的层级
    let depth=0;
    // 寻找到根节点为止
    // 渲染RouterView时,将当前组件上的data属性中的dataView标记为true
    // 相当于<routerView :data="true"/>,也即为该标签增加attribute
    // 每次渲染RouterView时,通过当前routerView向上查找,
    // 每当页面渲染一次都将该属性置为true
    // 在嵌套渲染时,只需向上递归查找dataView有几个true,表示是RouterView嵌套的第几层
    // $vnode表示当前组件渲染的展位标签符 => <my-component/>
    // _vnode是当前组件渲染的节点内容 => <div>hello</div>
    while(parent&&parent._routerRoot!==parent){
      // 获取父节点上标签的data
      const vnodeData=parent.$vnode?parent.$vnode.data:{};
      if(vnodeData.dataView){
        // 若parent.$vnode.dataview为true,表示当前routerView渲染过了
        depth++;
      }
      parent=parent.$parent;
    }
    // console.log(route.matched);
    const matchRoute=route.matched[depth];
    if(!matchRoute){
      return h();
    }
    return h(matchRoute.component,data);

  },
};
</script>