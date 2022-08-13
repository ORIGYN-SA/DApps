import React, { useEffect } from 'react';
import { Box, FormControlLabel, Switch } from '@mui/material';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import pick from 'lodash/pick';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState } from 'react';

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

  const handleExpandAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAll(event.target.checked);
    if (event.target.checked) {
      setExpanded([...init(0, all_index)]);
    } else {
      setExpanded([]);
    }
    setApps(false);
    setLibraries(false);
  };

  const handleExpandApps = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApps(event.target.checked);
    if (event.target.checked) {
      setExpanded([...init(apps_index[0], apps_index[1])]);
    } else {
      setExpanded([]);
    }
    setAll(false);
    setLibraries(false);
  };

  const handleExpandLibraries = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLibraries(event.target.checked);
    if (event.target.checked) {
      setExpanded([...init(libraries_index[0], libraries_index[1])]);
    } else {
      setExpanded([]);
    }
    setAll(false);
    setApps(false);
  };

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
          arr1.push({ id: increment(), name: j, children: [{ id: increment(), name: obj1[j] }] });
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
  const data: RenderTree = {
    id: '0',
    name: 'NFT',
    children: [...parseData(metadata)],
  };

  const renderTree = (nodes: RenderTree) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );
  return (
    <Box margin="6rem 0 0 0">
      <FormControlLabel
        control={<Switch onChange={handleExpandAll} checked={all} />}
        label="Expand All"
      />
      <FormControlLabel
        control={<Switch onChange={handleExpandApps} checked={apps} />}
        label="Expand Apps"
      />
      <FormControlLabel
        control={<Switch onChange={handleExpandLibraries} checked={libraries} />}
        label="Expand Libraries"
      />
      {Object.entries(metadata).length > 0 && (
        <TreeView
          aria-label="file system navigator"
          expanded={expanded}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          onNodeToggle={handleToggle}
          sx={{ height: 800, flexGrow: 1, maxWidth: 800, overflowY: 'auto' }}
        >
          {renderTree(data)}
        </TreeView>
      )}
    </Box>
  );
}

export default Tree;
