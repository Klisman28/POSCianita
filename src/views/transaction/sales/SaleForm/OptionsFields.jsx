import React from 'react'
import { Card, Checkbox } from 'components/ui'
import { Controller } from 'react-hook-form'

const OptionsFields = ({ control }) => {
    return (
        <Card className="mb-4">
            <div className="flex items-center justify-between mb-6">
                <Controller
                    control={control}
                    name="applyIgv"
                    render={({ field: { onChange, value } }) => (
                        <Checkbox onChange={onChange} value={value}>
                            Aplicar IGV (5%)
                        </Checkbox>
                    )}
                />
            </div>
        </Card>
    )
}

export default OptionsFields