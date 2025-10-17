(module $summer
  (import "env" "memory" (memory 1 1 shared))
  (func (export "process")
    (param $in0 i32)
    (param $in1 i32)
    (param $out i32)
    (param $len i32)
    (result i32)
    (local $end i32)
    (local $i i32)

    (local.set $end (i32.mul (local.get $len) (i32.const 2)))

    (loop $next
      (v128.store
        (i32.add (local.get $out) (local.get $i))
        (i16x8.add_sat_u
          (v128.load (i32.add (local.get $in0) (local.get $i)))
          (v128.load (i32.add (local.get $in1) (local.get $i)))
        )
      )

      (br_if $next
        (i32.lt_s
          (local.tee $i (i32.add (local.get $i) (i32.const 8)))
          (local.get $end)
        )
      )
    )

    (i32.const 0)
  )
)
