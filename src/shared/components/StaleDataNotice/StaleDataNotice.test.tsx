import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { StaleDataNotice } from './StaleDataNotice'

describe('StaleDataNotice', () => {
  it('warns that data may be outdated and offers to refresh', async () => {
    const onRetry = jest.fn()
    render(<StaleDataNotice onRetry={onRetry} />)
    expect(screen.getByRole('status')).toHaveTextContent('Connexion instable')

    await userEvent.click(screen.getByRole('button', { name: 'Actualiser' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<StaleDataNotice onRetry={jest.fn()} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
