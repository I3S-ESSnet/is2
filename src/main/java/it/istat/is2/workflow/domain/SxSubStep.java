/**
 * Copyright 2019 ISTAT
 *
 * Licensed under the EUPL, Version 1.1 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence. You may
 * obtain a copy of the Licence at:
 *
 * http://ec.europa.eu/idabc/eupl5
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * Licence for the specific language governing permissions and limitations under
 * the Licence.
 *
 * @author Francesco Amato <framato @ istat.it>
 * @author Mauro Bruno <mbruno @ istat.it>
 * @author Paolo Francescangeli  <pafrance @ istat.it>
 * @author Renzo Iannacone <iannacone @ istat.it>
 * @author Stefano Macone <macone @ istat.it>
 * @version 1.0
 */
package it.istat.is2.workflow.domain;

import java.io.Serializable;
import javax.persistence.*;

import lombok.Data;

/**
 * The persistent class for the SX_SUB_STEP database table.
 *
 */
@Data
@Entity
@Table(name = "SX_SUB_STEP")
@NamedQuery(name = "SxSubStep.findAll", query = "SELECT s FROM SxSubStep s")
public class SxSubStep implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    @Column(name = "ELSE_STEP")
    private Long elseStep;

    private Integer livello;

    // bi-directional many-to-one association to SxBusinessStep
    @ManyToOne
    @JoinColumn(name = "STEP")
    private SxBusinessStep sxBusinessStep1;

    // bi-directional many-to-one association to SxBusinessStep
    @ManyToOne
    @JoinColumn(name = "SUB_STEP")
    private SxBusinessStep sxBusinessStep2;

    public SxSubStep() {
    }

}
