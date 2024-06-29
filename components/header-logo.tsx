import Link from 'next/link'
import { Text, Box, useColorModeValue } from '@chakra-ui/react'
import IconCapitalCloud from './icons/icon'
import styled from '@emotion/styled'

const LogoBox = styled.span`
  font-weight: bold;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  height: 30px;
  line-height: 20px;
  padding: 10px;

  > svg {
    transition: 200ms ease;
  }

  &:hover > svg {
    transform: rotate(20deg);
  }
`

const HeaderLogo = () => {
    return (
        <Link href="/" scroll={false}>
            <LogoBox>
                <IconCapitalCloud />
                <Text
                    color={useColorModeValue('gray.800', 'whiteAlpha.900')}
                    fontFamily='"M PLUS Rounded 1c", sans-serif'
                    fontWeight="bold"
                    ml={3}
                >
                    TheCapitalCloud{' '}
                    <Box as="span" fontWeight="normal" fontSize="sm">
                        v1.0.1
                    </Box> 
                </Text>
            </LogoBox>
        </Link>
    )
}

export default HeaderLogo
