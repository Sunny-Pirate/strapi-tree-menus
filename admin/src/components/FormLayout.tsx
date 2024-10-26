import { Box, Grid, Typography, Card } from '@strapi/design-system'

import useTreeData from '../hooks/useTreeData'
import { useIntl } from 'react-intl'
import { GenericInput } from './GenericInputs'
import { getTranslation } from '../utils/getTranslation'
import { useEffect } from 'react'
import { Divider } from '@strapi/design-system'
import styled from 'styled-components'
import type { FlattenedItem } from '../types'
import { buildTree } from './SortableTree/utilities'
import { ValidationError } from 'yup'

const DividerFull = styled(Divider)`
  flex: 1;
`

interface FormLayoutProps {}

const FormLayout = ({ ...props }: FormLayoutProps) => {
  const { formatMessage } = useIntl()

  const {
    flattenedItems,
    items,
    setItems,
    activeItem,
    setActiveItem,
    schema: { attributes },
    onChange,
    validate,
    name,
    value,
    disabled,
  } = useTreeData()

  const handleChange = async (field: string, fieldValue: any) => {
    if (activeItem) {
      // @ts-ignore
      setActiveItem((item) => ({ ...item, [field]: fieldValue }))

      let newFlattenedItems = flattenedItems.map((item) => {
        if (item.id === activeItem.id) {
          item[field as keyof FlattenedItem] = fieldValue
        }
        return item
      })

      let newItems = buildTree(newFlattenedItems)

      let result = await validate(newItems)

      setItems(result.data)
      if (!result.errors) {
        onChange(result.data)
      } else {
        throw new ValidationError(result.errors)
      }
    }
  }

  useEffect(() => {
    if (activeItem) {
      console.log(activeItem['title' as keyof typeof activeItem])
    }
  }, [activeItem])

  return (
    <>
      {activeItem ? (
        <Card padding={2}>
          <Grid.Root gap={3}>
            <Grid.Item col={12} s={12} xs={12}>
              <Typography variant='delta' tag='h3'>
                {formatMessage(
                  {
                    id: getTranslation('tree-menus.edit-form.title'),
                    defaultMessage: 'Edit {0}',
                  },
                  { 0: activeItem.title }
                )}
              </Typography>
            </Grid.Item>
            <Grid.Item col={12} s={12} xs={12}>
              <DividerFull marginBottom={3} />
            </Grid.Item>

            {attributes.map((attribute) => {
              return (
                <Grid.Item key={attribute.id} col={12} s={12} xs={12} direction='column' alignItems='stretch'>
                  <Box>
                    <GenericInput
                      name={attribute.id}
                      value={activeItem[attribute.id as keyof typeof activeItem]}
                      type={attribute.type as any}
                      disabled={disabled}
                      required={attribute.required}
                      options={attribute.options}
                      intlLabel={{
                        id: getTranslation(`tree-menus.edit-form.${attribute.id}.label`),
                        defaultMessage: attribute.label,
                      }}
                      labelAction={<></>}
                      onChange={(e) => handleChange(attribute.id, e.target.value)}
                      placeholder={{
                        id: getTranslation(`tree-menus.edit-form.${attribute.id}.placeholder`),
                        defaultMessage: attribute.placeholder,
                      }}
                    />
                  </Box>
                </Grid.Item>
              )
            })}
          </Grid.Root>
        </Card>
      ) : null}
    </>
  )
}

export default FormLayout
