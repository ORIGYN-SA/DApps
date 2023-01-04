import React, { useEffect } from 'react';
import pick from 'lodash/pick';
import { useState } from 'react';
import { Container, Button, Flex } from '@origyn-sa/origyn-art-ui';

interface RenderTree {
  id: string;
  name: string;
  children?: readonly RenderTree[];
}

function Tree({ metadata }: any) {
  let all_index = 0;
  let apps_index: number[] = [0, 0];
  let libraries_index: number[] = [0, 0];
  const [expanded, setExpanded] = useState<string[]>([]);
  const [all, setAll] = React.useState(true);
  const [apps, setApps] = React.useState(false);
  const [libraries, setLibraries] = React.useState(false);

  const init = (start, end) => {
    let array: [string] = ['0'];
    array.push(start + '');
    if (Object.entries(metadata).length) {
      for (let i = start; i <= end; i++) {
        array.push(`${i}`);
      }
    }
    return array;
  };

  // const handleExpandAll = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setAll(event.target.checked);
  //   if (event.target.checked) {
  //     setExpanded([...init(0, all_index)]);
  //   } else {
  //     setExpanded([]);
  //   }
  //   setApps(false);
  //   setLibraries(false);
  // };

  // const handleExpandApps = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setApps(event.target.checked);
  //   if (event.target.checked) {
  //     setExpanded([...init(apps_index[0], apps_index[1])]);
  //   } else {
  //     setExpanded([]);
  //   }
  //   setAll(false);
  //   setLibraries(false);
  // };

  // const handleExpandLibraries = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setLibraries(event.target.checked);
  //   if (event.target.checked) {
  //     setExpanded([...init(libraries_index[0], libraries_index[1])]);
  //   } else {
  //     setExpanded([]);
  //   }
  //   setAll(false);
  //   setApps(false);
  // };

  const increment = () => {
    all_index++;
    return `${all_index}`;
  };
  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  useEffect(() => {
    setExpanded([...init(0, all_index)]);
  }, [metadata]);

  const parseData = (data) => {
    let arr: RenderTree[] = [];
    let obj = pick(data, [
      'owner',
      'hidden_asset',
      'preview_asset',
      'primary_asset',
      'experience_asset',
      'id',
    ]);

    for (let i in obj) {
      arr.push({ id: increment(), name: i, children: [{ id: increment(), name: obj[i] }] });
    }

    arr.push({
      id: increment(),
      name: '__apps',
      children: data.__apps?.map((item, i) => {
        apps_index[0] = all_index;

        let obj1 = { ...item.data };
        let arr1: RenderTree[] = [];
        for (let j in obj1) {
          arr1.push({
            id: increment(),
            name: j,
            children: [{ id: increment(), name: JSON.stringify(obj1[j]) }],
          });
        }

        return {
          id: increment(),
          name: `${i + 1}`,
          children: [
            { id: increment(), name: 'app_id', children: [{ id: increment(), name: item.app_id }] },
            { id: increment(), name: 'read', children: [{ id: increment(), name: item.read }] },
            {
              id: increment(),
              name: 'write',
              children: [
                {
                  id: increment(),
                  name: 'type',
                  children: [{ id: increment(), name: item.write.type }],
                },
                {
                  id: increment(),
                  name: 'list',
                  children: item.write.list.map((x) => ({ id: increment(), name: x })),
                },
              ],
            },
            {
              id: increment(),
              name: 'permissions',
              children: [
                {
                  id: increment(),
                  name: 'type',
                  children: [{ id: increment(), name: item.permissions.type }],
                },
                {
                  id: increment(),
                  name: 'list',
                  children: item.permissions.list.map((x) => ({ id: increment(), name: x })),
                },
              ],
            },
            { id: increment(), name: 'data', children: [...arr1] },
          ],
        };
      }),
    });
    apps_index[1] = all_index;

    libraries_index[0] = all_index + 1;
    arr.push({
      id: increment(),
      name: 'library',
      children: data.library?.map((item, i) => {
        let obj1: RenderTree[] = [];
        for (let j in item) {
          obj1.push({ id: increment(), name: j, children: [{ id: increment(), name: item[j] }] });
        }

        return { id: increment(), name: i + 1, children: [...obj1] };
      }),
    });
    libraries_index[1] = all_index;

    return arr;
  };
  const data: any = {
    id: '0',
    name: 'NFT',
    children: [...parseData(metadata)],
  };

  const Tree = ({ treeData }) => {
    return (
      <ul>
        {treeData.map((node) => (
          <TreeNode node={node} key={node.id} />
        ))}
      </ul>
    );
  };

  const TreeNode = ({ node }) => {
    const { children, name } = node;
    const [showChildren, setShowChildren] = useState(false);
    const handleClick = () => {
      setShowChildren(!showChildren);
    };
    return (
      <>
        <div style={{ marginBottom: '10px' }}>
          {children ? <h5 onClick={handleClick}>{name}</h5> : <span>{name}</span>}
        </div>
        <ul style={{ paddingLeft: '30px'}}>
          {showChildren && <Tree treeData={children} />}
        </ul>
      </>
    );
  };

  const [showChildren, setShowChildren] = useState(false);

  const handleClick = () => {
    setShowChildren(!showChildren);
  };

  const handleClose = () => {
    setShowChildren(false);
  };

  return (
    <Container padding="16px">
      <Flex flexFow='row' gap={16}>
      <Button btnType="filled" onClick={handleClose}>Close All</Button>
      <Button btnType="filled" onClick={handleClose}>Expand All</Button>
      <Button btnType="filled" onClick={handleClose}>Expand Libraries</Button>
      </Flex>
     <br/>
      <div>
      <h4 onClick={handleClick}>NFT </h4>
      <br/>
      {showChildren && <Tree treeData={data.children}/>}
      </div>
      
    </Container>
  );
}

export default Tree;
